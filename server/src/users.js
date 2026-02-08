import { prisma } from "./db.js";

// GET /users
export async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    orderBy: [{ lastLoginAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  res.json({ users });
}

// POST /users/block
export async function blockUsers(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ message: "ids required" });

  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { status: "blocked" },
  });

  res.json({ ok: true });
}

// POST /users/unblock
export async function unblockUsers(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ message: "ids required" });

  // Unblock -> active (even if previously unverified? spec says unverified/active/blocked exist;
  // simplest: set to active)
  await prisma.user.updateMany({
    where: { id: { in: ids } },
    data: { status: "active" },
  });

  res.json({ ok: true });
}

// DELETE /users  (bulk delete by ids)
export async function deleteUsers(req, res) {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0)
    return res.status(400).json({ message: "ids required" });

  await prisma.user.deleteMany({
    where: { id: { in: ids } },
  });

  res.json({ ok: true });
}

// DELETE /users/unverified
export async function deleteUnverified(req, res) {
  await prisma.user.deleteMany({
    where: { status: "unverified" },
  });

  res.json({ ok: true });
}
