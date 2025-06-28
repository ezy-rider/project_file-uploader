import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/prisma/index.js";

import passport from "passport";
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
  res.render("log-in");
}

export function logInPost(req, res, next) {
  return passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
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
