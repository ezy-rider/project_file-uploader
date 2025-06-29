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
  const id = Number(req.params.id);
  const folder = await prisma.folder.findUnique({
    where: { id },
    include: { files: true },
  });

  console.dir(folder);
  res.render("folders/folder", { folder: folder });
}

export function uploadGet(req, res) {
  res.render("folders/upload", { message: null, id: req.params.id });
}

export async function uploadPost(req, res) {
  console.log("Uploaded file:", req.file);

  const folderId = Number(req.params.id);
  const file = req.file;

  try {
    await prisma.file.create({
      data: {
        name: file.originalname,
        path: file.path,
        folderId: folderId,
      },
    });

    res.redirect(`/folders/${req.params.id}`);
  } catch (err) {
    next(err);
  }
}

export async function deleteFolderPost(req, res, next) {
  const folderId = Number(req.params.id);

  try {
    await prisma.folder.delete({ where: { id: folderId } });
    res.redirect("/folders");
  } catch (err) {
    next(err);
  }
}

export async function updateFolderGet(req, res, next) {
  const folderId = Number(req.params.id);
  const folder = await prisma.folder.findUnique({ where: { id: folderId } });
  res.render("folders/update", { folder: folder });
}

export async function updateFolderPost(req, res, next) {
  const folderId = Number(req.params.id);
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
