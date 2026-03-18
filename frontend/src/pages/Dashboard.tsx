import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getApplications,
  createApplication,
  updateStatus,
} from "../services/applicationService";

type Application = {
  _id: string;
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  notes?: string;
};

const Dashboard = () => {
  const [applications, setApplications] = useState<Application[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getApplications({});
      setApplications(data);
    } catch {
      toast.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!company || !role || !appliedDate) {
      toast.error("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await createApplication({
        company,
        role,
        status,
        appliedDate,
        notes,
      });

      toast.success("Application added");

      setCompany("");
      setRole("");
      setStatus("Applied");
      setAppliedDate("");
      setNotes("");

      fetchData();
    } catch {
      toast.error("Failed to add application");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus);
      toast.success("Status updated");
      fetchData();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow mb-6">
        <form onSubmit={handleAdd} className="grid gap-3">
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded"
          >
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 rounded"
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded"
          >
            {loading ? "Adding..." : "Add Application"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-gray-500">
            No applications yet. Start by adding one.
          </p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <p className="font-bold">{app.company}</p>
              <p className="text-sm text-gray-500">{app.role}</p>

              <p className="text-xs text-gray-400">
                Applied: {new Date(app.appliedDate).toLocaleDateString()}
              </p>

              {/* STATUS BADGE */}
              <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                {app.status}
              </span>

              {/* NOTES */}
              {app.notes && (
                <p className="text-sm text-gray-600 mt-2">
                  📝 {app.notes}
                </p>
              )}

              {/* STATUS UPDATE DROPDOWN */}
              <select
                className="border p-2 rounded mt-3"
                value={app.status}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
              >
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;