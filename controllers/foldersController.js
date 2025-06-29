import { formatBytes } from "../lib/formatBytes.js";
import { prisma } from "../lib/prisma.js";
import { supabase } from "../lib/supabase.js";

export async function foldersGet(req, res, next) {
  try {
    const foldersLinks = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });
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
  const userId = req.user.id;

  try {
    await prisma.folder.create({
      data: { name: folderName, userId: userId },
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
  const folderId = Number(req.params.folderId);
  const file = req.file;

  try {
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(`${folderId}/${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    const { data: urlData, error: urlError } = supabase.storage
      .from("uploads")
      .getPublicUrl(data.path);

    if (urlError) throw urlError;

    const publicUrl = urlData.publicUrl;

    await prisma.file.create({
      data: {
        name: file.originalname,
        path: publicUrl,
        folderId: folderId,
        size: formatBytes(file.size),
      },
    });

    console.log(`/folders/${req.params.folderId}`);
    res.redirect(`/folders/${req.params.folderId}`);
  } catch (err) {
    console.error("Upload error:", err);

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
