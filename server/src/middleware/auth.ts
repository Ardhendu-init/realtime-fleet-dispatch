import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No authorization header " });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid Token " });
  }
}
