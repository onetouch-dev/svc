import { Router } from "express";
import verifyToken from "../middleware.js/verfityToken";

import userController from "./controller";

const userRouter = Router();
userRouter.route('/login')
    .post(userController.login);

userRouter.route('/signup')
    .post(userController.signup);

userRouter.route('/profile')
    .get(verifyToken, userController.authUser);

userRouter.route('/update')
    .put(verifyToken, userController.updateProfile);

userRouter.route('/refresh-token')
    .post(userController.refreshToken);

userRouter.route('/logout')
    .delete(userController.logout);

export default userRouter;