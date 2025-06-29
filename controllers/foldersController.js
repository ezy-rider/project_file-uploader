import { formatBytes } from "../lib/formatBytes.js";
import { prisma } from "../lib/prisma.js";

export async function foldersGet(req, res, next) {
  try {
    const foldersLinks = await prisma.folder.findMany();
    console.log(foldersLinks);
    res.render("folders/folders", { foldersLinks: foldersLinks });
  } catch (err) {
    next(err);
  }
}

export function addFolderGet(req, res) {
  res.render("folders/add");
}

export async function addFolderPost(req, res, next) {
  const folderName = req.body.name;
  try {
    await prisma.folder.create({
      data: { name: folderName },
    });
  } catch (err) {
    next(err);
  }

  res.redirect("/folders");
}

export async function folderGet(req, res, next) {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    include: { files: true },
  });

  console.dir(folder);
  res.render("folders/folder", { folder: folder });
}

export function uploadGet(req, res) {
  res.render("folders/upload", { message: null, id: req.params.folderId });
}

export async function uploadPost(req, res, next) {
  console.log("Uploaded file:", req.file);

  const folderId = Number(req.params.folderId);
  const file = req.file;

  try {
    await prisma.file.create({
      data: {
        name: file.originalname,
        path: file.path,
        folderId: folderId,
        size: formatBytes(file.size),
      },
    });

    res.redirect(`/folders/${req.params.folderId}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteFolderPost(req, res, next) {
  const folderId = Number(req.params.folderId);

  try {
    await prisma.folder.delete({ where: { id: folderId } });
    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
}

export async function updateFolderGet(req, res, next) {
  const folderId = Number(req.params.folderId);
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });
  res.render("folders/update", { folder: folder });
}

export async function updateFolderPost(req, res, next) {
  const folderId = Number(req.params.folderId);
  const newFolderName = req.body.name;

  try {
    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: newFolderName,
      },
    });
    res.redirect(`/folders/${folderId}`);
  } catch (err) {
    next(err);
  }
}

export async function fileGet(req, res, next) {
  const fileId = Number(req.params.fileId);
  const folderId = Number(req.params.folderId);

  try {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    res.render("folders/file", { file: file, folderId: folderId });
  } catch (err) {
    next(err);
  }
}

export async function downloadFileGet(req, res, next) {
  const fileId = Number(req.params.fileId);

  try {
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).send("File not found");
    res.download(file.path, file.name);
  } catch (err) {
    next(err);
  }
}
