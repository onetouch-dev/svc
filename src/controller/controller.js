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
            const { body: { username, password }, user } = req;

            const tokenData = { email: username, name: user.name, _id: user._id }
            bcrypt.compare(password, user.password, async (err, result) => {
                if (!result) {
                    next({
                        status: 400,
                        message: "Wrong Password"
                    })
                }
                const accessToken = generateAccessToken(tokenData);
                const refreshToken = generateRefreshToken(tokenData);

                const refreshTokenOperation = new RefreshTokenOperation();
                const tokens = await refreshTokenOperation.findOne({ userId: user._id });
                if (!tokens) {
                    await refreshTokenOperation.create({
                        token: refreshToken,
                        userId: user._id
                    })
                } else {
                    await refreshTokenOperation.findOneAndUpdate({ userId: user._id }, { token: refreshToken })
                }
                res.status(200).send({
                    status: 200,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            })
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
                data: docs
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
            const { user } = req;

            const payload = generateUpdatePaylod({ ...req.body });
            const userOperation = new UserOperation();
            const { modifiedCount } = await userOperation.update({ _id: user._id }, payload);
            if (modifiedCount > 0) {
                const updatedDoc = await userOperation.findOne({ _id: user._id });
                res.status(200).send({
                    status: 200,
                    data: updatedDoc
                });
            } else {
                next({
                    message: "Bad request",
                    status: 400
                })
            };
        } catch (err) {
            next({
                message: err.message,
                status: 400
            });
        };
    };

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
                    message: "Token expired, Login again",
                    status: 400
                })
            } else {
                const { modifiedCount } = await refreshTokenOperation.update({ _id: isVerified._id }, { token: refreshToken });
                if (modifiedCount > 0) {
                    res.status(200).send({
                        status: 200,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    });
                } else {
                    next({
                        message: "Invalid token",
                        status: 400
                    });
                };
            };
        } catch (err) {
            next({
                message: err.message || "Bad request",
                status: 400
            });
        };
    };

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

    async changePassword(req, res, next) {
        try {
            const { body: { currentPassword, newPassword }, user } = req;
            bcrypt.compare(currentPassword, user.password, async (err, result) => {
                if (result) {
                    const hash = await bcrypt.hash(newPassword, parseInt(configuration.saltRound));
                    const userOperation = new UserOperation();
                    const { modifiedCount } = await userOperation.update({ _id: user._id }, { password: hash });
                    if (modifiedCount > 0) {
                        res.status(200).send({
                            status: 200,
                            message: "password changed"
                        })
                    } else {
                        next({
                            message: "Bad request",
                            status: 400
                        })
                    }
                } else {
                    next({
                        message: "Wrong password",
                        status: 400
                    })
                }
            })
        } catch (err) {
            next({
                message: err.message || "Bad request",
                status: 400
            })
        }
    }
}

export default userController.getInstance();
