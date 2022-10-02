import jwt from "jsonwebtoken";

import configuration from "../configuration";

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            next({
                message: "token required",
                status: 401
            })
        }

        const decoded = jwt.verify(token, configuration.accesstokenSecretKey)
        req.user = decoded;
        next();
    } catch (err) {
        next({
            message: "Invalid token",
            status: 401
        })
    }
};

export default verifyToken;
