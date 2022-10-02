import jwt, { decode } from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import configuration from "../configuration";
import {
    generateAccessToken,
    generateRefreshToken,
    generateUpdatePaylod,
} from "./helper";

import UserOperation from "../reository/user/operation";
import RefreshTokenOperation from "../reository/refreshToken/operation";

class userController {
    static instance;
    static getInstance() {
        if (userController.instance) {
            return userController.instance;
        }
        userController.instance = new userController();
        return userController.instance;
    }

    async login(req, res, next) {
        try {
            const { body: { username, password } } = req;
            const userOperation = new UserOperation();

            const doc = await userOperation.findOne({ email: username });
            if (doc) {
                const tokenData = { email: doc.email, name: doc.name, _id: doc._id }
                bcrypt.compare(password, doc.password, async (err, result) => {
                    if (result) {
                        const accessToken = generateAccessToken(tokenData);
                        const refreshToken = generateRefreshToken(tokenData);

                        const refreshTokenOperation = new RefreshTokenOperation();
                        const tokens = await refreshTokenOperation.findOne({ userId: doc._id });
                        if (!tokens) {
                            await refreshTokenOperation.create({
                                token: refreshToken,
                                userId: doc._id
                            })
                        } else {
                            await refreshTokenOperation.findOneAndUpdate({ userId: doc._id }, { token: refreshToken })
                        }

                        res.status(200).send({ 
                            status: 200,
                            accessToken: accessToken, 
                            refreshToken: refreshToken })
                    } else {
                        next({
                            status: 400,
                            message: "Bad request"
                        })
                    }
                })
            } else {
                next({
                    status: 401,
                    message: "authentication failed"
                })
            }
        } catch (err) {
            next({
                message: err.message || "Bad request",
                status: err.status || 400
            })
        }

    };

    async signup(req, res, next) {
        try {
            const { body: { email, name, password } } = req;
            const userOperation = new UserOperation();
            const user = await userOperation.findOne({ email });
            if (user) {
                next({
                    status: 400,
                    message: "user already exists"
                })
            } else {
                const hash = await bcrypt.hash(password, parseInt(configuration.saltRound))
                const docs = await userOperation.create({ name, email, password: hash })
                if (docs) {
                    const tokenData = { email: docs.email, name: docs.name, _id: docs._id }
                    const accessToken = generateAccessToken(tokenData);
                    const refreshToken = generateRefreshToken(tokenData);

                    const refreshTokenOperation = new RefreshTokenOperation();
                    const tokens = await refreshTokenOperation.findOne({ userId: docs._id });
                    if (!tokens) {
                        await refreshTokenOperation.create({
                            token: refreshToken,
                            userId: docs._id
                        })
                    } else {
                        await refreshTokenOperation.findOneAndUpdate({ userId: doc._id }, { token: refreshToken })
                    }

                    res.status(200).send({ status: 200, accessToken, refreshToken })
                } else {
                    next({
                        message: "Bad request",
                        status: 400
                    })
                }

            }
        } catch (err) {
            next({
                message: err.message || "Bad request",
                status: err.status || 400
            })
        }
    }

    async authUser(req, res, next) {
        try {
            const { user } = req;
            const userOperation = new UserOperation();
            const docs = await userOperation.findOne({ email: user.email });
            res.status(200).send({
                status: 200,
                data: {
                    ...user,
                    imageUrl: docs.imageUrl || null
                }
            })
        } catch (err) {
            next({
                message: "Bad request",
                status: 400
            })
        }
    }

    async updateProfile(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const { user } = req;

            if (req.body?.email) {
                next({
                    message: "Bad request",
                    status: 400
                })
            };

            let hash;
            if (req.body?.password) {
                hash = await bcrypt.hash(req.body.password, parseInt(configuration.saltRound))
            }

            const userOperation = new UserOperation();
            if (user) {
                const payload = hash ? generateUpdatePaylod({ ...req.body, password: hash }) : generateUpdatePaylod({ ...req.body });
                const { modifiedCount } = await userOperation.update({ _id: user._id }, payload);
                if (modifiedCount > 0) {
                    const updatedDoc = await userOperation.findOne({ _id: user._id })
                    res.status(200).send(updatedDoc)
                } else {
                    next({
                        message: "Bad request",
                        status: 400
                    })
                }
            }
        } catch (err) {
            next({
                message: err.message,
                status: 400
            })
        }
    }

    async refreshToken(req, res, next) {
        try {
            const token = req.body.refreshToken;

            if (!token) next({
                message: "No token found",
                status: 400
            })

            const decoded = jwt.verify(token, configuration.refreshtokenSecretKey)
            if (!decoded) {
                next({
                    message: "Invalid token",
                    status: 400
                })
            }

            const accessToken = generateAccessToken({ name: decoded.name, email: decoded.email, _id: decoded._id });
            const refreshToken = generateRefreshToken({ name: decoded.name, email: decoded.email, _id: decoded._id });

            const refreshTokenOperation = new RefreshTokenOperation();
            const isVerified = await refreshTokenOperation.findOne({ token });
            if (!isVerified) {
                next({
                    message: "Token has expired",
                    status: 400
                })
            } else {
                const { modifiedCount } = await refreshTokenOperation.update({ _id: isVerified._id }, { token: refreshToken });
                if (modifiedCount > 0) {
                    res.status(200).send({
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    })
                } else {
                    next({
                        message: "Invalid token",
                        status: 400
                    })
                }
            }

        } catch (err) {
            next({
                message: err.message || "Bad request",
                status: 400
            })
        }
    }

    async logout(req, res, next) {
        try {
            const { body: { refreshToken } } = req;
            const refreshTokenOperation = new RefreshTokenOperation();
            const { deletedCount } = await refreshTokenOperation.delete({ token: refreshToken });
            if (deletedCount > 0) {
                res.status(200).send({
                    status: 200,
                    message: "Logout successful"
                })
            } else {
                next({
                    message: "Bad request",
                    status: 400
                })
            }
        } catch (err) {
            next({
                message: err.message || "Bad request",
                status: 400
            })
        }
    }
}

export default userController.getInstance();
