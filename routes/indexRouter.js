import { Router } from "express";
import * as controller from "../controllers/indexController.js";

export const indexRouter = Router();

indexRouter.get("/", controller.index);

indexRouter.get("/sign-up", controller.signUpGet);
indexRouter.post("/sign-up", controller.signUpPost);

indexRouter.get("/log-in", controller.logInGet);
indexRouter.post("/log-in", controller.logInPost);

indexRouter.post("/log-out", controller.logOutPost);
