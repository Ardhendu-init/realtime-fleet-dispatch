import { PrismaClient } from "@prisma/client";

import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "User not found " });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successfull",
    token,
    user,
  });
});

export default router;
