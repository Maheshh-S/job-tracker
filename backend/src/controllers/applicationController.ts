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
    const { status, date } = req.query;

    let filter: any = {
      user: (req as any).userId,
    };

    if (status) {
      filter.status = status;
    }

    if (date) {
      filter.appliedDate = new Date(date as string);
    }

    const applications = await Application.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//updating  API (status change) 
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
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};