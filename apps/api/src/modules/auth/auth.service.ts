import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http-error.js";
import { userRepository } from "../../repositories/user.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

const buildToken = (userId: string, email: string) =>
  jwt.sign({ userId, email }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const authService = {
  async register(input: RegisterInput) {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new HttpError(409, "User already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await userRepository.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });

    return {
      token: buildToken(user.id, user.email),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },
  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    return {
      token: buildToken(user.id, user.email),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  },
};
