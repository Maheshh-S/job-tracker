import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  user: mongoose.Types.ObjectId;
  company: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },//user - co
    company: {
      type: String,
      required: true,
      trim: true,
    },//co -role
    role: {
      type: String,
      required: true,
      trim: true,
    },//role - status
    status: {
      type: String,
      enum: ["Applied", "Interviewing", "Offer", "Rejected"],
      default: "Applied",
    },//if apply

    appliedDate: {
      type: Date,
      required: true,
    },

    notes: {
         type: String,
         default: "",
    },
    
  },
  {
    timestamps: true,
  },
  
);

const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);



export default Application;