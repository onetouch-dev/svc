import { Router } from "express";

import { verifyToken, authenticateUser } from "../middleware";
import userController from "./controller";

const userRouter = Router();
userRouter.route('/login')
    .post(authenticateUser, userController.login);

userRouter.route('/signup')
    .post(userController.signup);

userRouter.route('/profile')
    .get(verifyToken, userController.authUser);

userRouter.route('/update')
    .put(verifyToken, userController.updateProfile);

userRouter.route('/change-password')
    .patch(verifyToken, userController.changePassword)

userRouter.route('/refresh-token')
    .post(userController.refreshToken);

userRouter.route('/logout')
    .delete(userController.logout);

export default userRouter;