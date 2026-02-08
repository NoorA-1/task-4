import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "./db.js";
import { config } from "./config.js";
import crypto from "crypto";

function signToken(user) {
  return jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" });
}

// POST /auth/register
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const verificationToken = cryptoRandomToken();

    // IMPORTANT: no pre-check for existing email. Let DB unique index enforce it.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        status: "unverified",
        verificationToken,
      },
      select: { id: true, email: true, status: true },
    });

    // Async email: for today, just log link (non-blocking)
    const confirmUrl = `${config.apiBaseUrl}/auth/confirm?token=${verificationToken}`;
    console.log("[CONFIRM LINK]", confirmUrl);

    return res.status(201).json({
      message: "Registered successfully. Please confirm your email.",
      user,
    });
  } catch (err) {
    // Postgres unique violation
    if (err?.code === "P2002") {
      // Prisma unique constraint error (if it thinks there's a unique constraint)
      return res.status(409).json({ message: "Email is already registered." });
    }

    // If you're using raw SQL unique index (lower(email)), Postgres error surfaces like this:
    if (err?.meta?.cause?.code === "23505" || err?.code === "23505") {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Prisma sometimes wraps Postgres errors:
    if (String(err?.message || "").includes("users_email_uq")) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

// POST /auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required." });

    // Find by email case-insensitively (since uniqueness is LOWER(email))
    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
    });

    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({ code: "USER_BLOCKED", message: "Your account is blocked." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials." });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = signToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error." });
  }
}

// GET /auth/confirm?token=...
export async function confirmEmail(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token.");

    const user = await prisma.user.findFirst({
      where: { verificationToken: String(token) },
    });
    if (!user) return res.status(404).send("Invalid or expired token.");

    // blocked stays blocked. Only unverified -> active.
    if (user.status !== "blocked") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: "active",
          emailVerifiedAt: new Date(),
          verificationToken: null,
        },
      });
    } else {
      // optional: clear token + mark verified time even if blocked (ok either way)
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
          verificationToken: null,
        },
      });
    }

    // For now, plain response (later you can redirect to frontend)
    return res.send("Email confirmed. You can close this page.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error.");
  }
}

function cryptoRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}
