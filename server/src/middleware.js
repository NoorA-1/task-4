import jwt from "jsonwebtoken";
import { prisma } from "./db.js";
import { config } from "./config.js";

// Central "still allowed?" check middleware
export async function requireActiveUser(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ code: "NO_TOKEN", message: "Unauthorized." });
    }

    let payload;
    try {
      payload = jwt.verify(token, config.jwtSecret);
    } catch {
      return res
        .status(401)
        .json({ code: "BAD_TOKEN", message: "Unauthorized." });
    }

    const userId = payload.userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res
        .status(401)
        .json({ code: "USER_DELETED", message: "User no longer exists." });
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ code: "USER_BLOCKED", message: "User is blocked." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}
