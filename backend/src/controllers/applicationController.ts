import { Request, Response } from "express";
import Application from "../models/Application";

//Create application yes - for carre
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { company, role, status, appliedDate } = req.body;

    if (!company || !role || !appliedDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await Application.create({
      user: (req as any).userId,
      company,
      role,
      status,
      appliedDate,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all applications for logged-in user - so he sees
export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({
      user: (req as any).userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};