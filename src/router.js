import { Router } from "express";

import userRouter from "./controller";

const mainRouter = Router();

mainRouter.use('/user', userRouter);

export default mainRouter;