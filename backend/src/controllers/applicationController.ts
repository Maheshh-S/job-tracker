import { Request, Response } from "express";
import Application from "../models/Application";

// CREATE APPLICATION
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { company, role, status, appliedDate, notes } = req.body;

    if (!company || !role || !appliedDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const application = await Application.create({
      user: (req as any).userId,
      company,
      role,
      status,
      appliedDate,
      notes: notes || "",
    });

    res.status(201).json(application);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET APPLICATIONS
export const getApplications = async (req: Request, res: Response) => {
  try {
    const { status, date } = req.query;

    let filter: any = {
      user: (req as any).userId,
    };

    if (status) filter.status = status;
    if (date) filter.appliedDate = new Date(date as string);

    const applications = await Application.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE STATUS
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findOne({
      _id: id,
      user: (req as any).userId,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE APPLICATION
export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await Application.findOneAndDelete({
      _id: id,
      user: (req as any).userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};