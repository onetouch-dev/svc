import UserOperation from "../reository/user/operation";

const authenticateUser = async (req, res, next) => {
    try {
        const { body: { username } } = req;
        const userOperation = new UserOperation();

        const doc = await userOperation.findOne({ email: username });
        req.user = doc;
        if (!doc) {
            next({
                message: "Authentication failed",
                status: 401
            })
        }
        next();
    } catch (err) {
        next({
            message: "Authentication failed",
            status: 401
        })
    }
};

export default authenticateUser;
