import express from "express";
import { register, login, confirmEmail } from "./auth.js";
import { requireActiveUser } from "./middleware.js";
import {
  listUsers,
  blockUsers,
  unblockUsers,
  deleteUsers,
  deleteUnverified,
} from "./users.js";

export const router = express.Router();

// Public
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/confirm", confirmEmail);

// Protected (central middleware applied)
router.use(requireActiveUser);

router.get("/users", listUsers);
router.post("/users/block", blockUsers);
router.post("/users/unblock", unblockUsers);
router.delete("/users", deleteUsers);
router.delete("/users/unverified", deleteUnverified);
