import { Router } from "express";
import * as controller from "../controllers/foldersController.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
export const foldersRouter = Router();

foldersRouter.get("/", controller.foldersGet);

foldersRouter.get("/add", controller.addFolderGet);
foldersRouter.post("/add", controller.addFolderPost);

foldersRouter.get(
  "/:folderId/upload",
  ensureAuthenticated,
  controller.uploadGet
);

foldersRouter.post(
  "/:folderId/upload",
  ensureAuthenticated,
  upload.single("file"),
  controller.uploadPost
);

foldersRouter.post(
  "/:folderId/delete",
  ensureAuthenticated,
  controller.deleteFolderPost
);
foldersRouter.get(
  "/:folderId/update",
  ensureAuthenticated,
  controller.updateFolderGet
);
foldersRouter.post(
  "/:folderId/update",
  ensureAuthenticated,
  controller.updateFolderPost
);

foldersRouter.get("/:folderId", controller.folderGet);
foldersRouter.get("/:folderId/:fileId", controller.fileGet);

foldersRouter.get("/:folderId/:fileId/download", controller.downloadFileGet);
// foldersRouter.post("/:", controller.addFolderPost);
