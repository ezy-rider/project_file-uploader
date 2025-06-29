import { Router } from "express";
import * as controller from "../controllers/foldersController.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
export const foldersRouter = Router();

foldersRouter.get("/", controller.foldersGet);

foldersRouter.get("/add", controller.addFolderGet);
foldersRouter.post("/add", controller.addFolderPost);

foldersRouter.get("/:id/upload", ensureAuthenticated, controller.uploadGet);

foldersRouter.post(
  "/:id/upload",
  ensureAuthenticated,
  upload.single("file"),
  controller.uploadPost
);

foldersRouter.post(
  "/:id/delete",
  ensureAuthenticated,
  controller.deleteFolderPost
);
foldersRouter.get(
  "/:id/update",
  ensureAuthenticated,
  controller.updateFolderGet
);
foldersRouter.post(
  "/:id/update",
  ensureAuthenticated,
  controller.updateFolderPost
);

foldersRouter.get("/:id", controller.folderGet);
// foldersRouter.post("/:", controller.addFolderPost);
