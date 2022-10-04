import jwt from "jsonwebtoken";

import configuration from "../configuration";
import UserOperation from "../reository/user/operation";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            next({
                message: "token required",
                status: 401
            })
        }

        const decoded = jwt.verify(token, configuration.accesstokenSecretKey);
        const userOperation = new UserOperation();
        const { password } = await userOperation.findOne({ email: decoded.email });
        req.user = { ...decoded, password };
        next();
    } catch (err) {
        next({
            message: "Invalid token",
            status: 401
        })
    }
};

export default verifyToken;
