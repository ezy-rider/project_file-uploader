import path from "node:path";
import { Pool } from "pg";
import express from "express";
import passport from "passport";
import "dotenv/config";
import { indexRouter } from "./routes/indexRouter.js";
import configurePassport from "./config/passport.js";
import { setCurrentUser } from "./middleware/setCurrentUser.js";
import sessionMiddleware from "./config/session.js";
import { foldersRouter } from "./routes/foldersRouter.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
const port = 3000;
const __dirname = import.meta.dirname;

// view settings
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// express init
app.use(sessionMiddleware);

// passport init
app.use(passport.session());
configurePassport(passport);
app.use(setCurrentUser);

// routes
app.use("/", indexRouter);
app.use("/folders", foldersRouter);

app.listen(port, () => console.log(`Listen at http://localhost:${port}`));
