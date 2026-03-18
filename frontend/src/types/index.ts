export type ApplicationStatus = "Applied" | "Interviewing" | "Offer" | "Rejected";

export interface Application {
  _id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  location?: string;
  salary?: string;
  contact?: string;
}

export interface Column {
  id: ApplicationStatus;
  title: string;
  color: string;
  icon: string;
}