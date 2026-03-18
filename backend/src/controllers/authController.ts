import { Request, Response } from "express";
import User from "../models/User";
import { generateAccessToken } from "../utils/generateToken";


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


//-------------ok now login below



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const accessToken = generateAccessToken(user._id.toString());

    res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};