import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from 'dotenv';
dotenv.config();
interface JwtPayload {
  id: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

const authUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded; // ✅ now typescript will allow

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default authUser;