import { Request, Response } from "express";
import User from "../models/User";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create user
    const user = await User.create({ email, password });

    res.status(201).json({
      message: "User created successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};