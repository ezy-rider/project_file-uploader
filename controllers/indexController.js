import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/index.js";

import passport from "passport";
import upload from "../middleware/upload.js";
const prisma = new PrismaClient();

export function index(req, res) {
  res.render("index");
}

export function signUpGet(req, res) {
  res.render("sign-up");
}

export async function signUpPost(req, res, next) {
  try {
    const username = req.body.username;
    const existingUser = await prisma.user.findUnique({
      where: { name: username },
    });
    if (existingUser) {
      return res.status(400).send("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
      },
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    next(err);
  }
}

export function logInGet(req, res) {
  res.render("log-in", { error: null });
}

export function logInPost(req, res, next) {
  return passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("log-in", { error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
}

export function logOutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
}
