import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getApplications,
  createApplication,
  updateStatus,
} from "../services/applicationService";

const Dashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [notes, setNotes] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchData = async () => {
    try {
      const data = await getApplications({
        status: filterStatus || undefined,
        date: filterDate || undefined,
      });
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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

          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border p-2 rounded"
          />

          <button className="bg-blue-600 text-white p-2 rounded">
            Add Application
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{app.company}</p>
            <p>{app.role}</p>

            <p className="text-xs text-gray-400">
              Applied: {new Date(app.appliedDate).toLocaleDateString()}
            </p>

            {app.notes && <p>📝 {app.notes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;