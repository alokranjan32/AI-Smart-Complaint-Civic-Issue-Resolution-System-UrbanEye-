import bcrypt from "bcrypt";

import prisma from "../utils/prisma.js";
import { addUser, findUserByEmail } from "../data/mockStore.js";

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...safeUser } = user;
  return safeUser;
}

function buildUserPayload({ name, email, passwordHash, role = "CITIZEN" }) {
  return {
    id: crypto.randomUUID(),
    name,
    email,
    password: passwordHash,
    role,
    createdAt: new Date().toISOString(),
  };
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    if (prisma && process.env.DATABASE_URL) {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists." });
      }

      const user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: passwordHash,
        },
      });

      return res.status(201).json({ user: sanitizeUser(user) });
    }

    const existingUser = findUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const user = addUser(
      buildUserPayload({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      }),
    );

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (prisma && process.env.DATABASE_URL) {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      return res.json({ user: sanitizeUser(user) });
    }

    const user = findUserByEmail(normalizedEmail);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};
