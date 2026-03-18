import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET as string,
    { expiresIn: "15m" }
  );
};