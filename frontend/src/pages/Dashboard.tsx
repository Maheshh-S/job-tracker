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

  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const fetchData = async () => {
    try {
      const data = await getApplications({
        status: filterStatus || undefined,
        date: filterDate || undefined,
      });
      setApplications(data);
    } catch (error) {
      console.error(error);
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

    await createApplication({
      company,
      role,
      status,
      appliedDate,
    });

    setCompany("");
    setRole("");
    setStatus("Applied");
    setAppliedDate("");

    fetchData();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
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
        <h2 className="text-lg font-semibold mb-4">Add Application</h2>

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <input
            className="border p-2 rounded"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
          />

          <button className="bg-blue-600 text-white p-2 rounded col-span-1 md:col-span-2">
            Add Application
          </button>
        </form>
      </div>

      {/* FILTER */}
      <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter</h2>

        <div className="flex flex-col md:flex-row gap-3">
          <select
            className="border p-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>

          <input
            type="date"
            className="border p-2 rounded"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />

          <button
            onClick={fetchData}
            className="bg-gray-800 text-white px-4 rounded"
          >
            Apply
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="max-w-4xl mx-auto space-y-4">
        {applications.length === 0 ? (
          <p className="text-center text-gray-500">No applications found</p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{app.company}</p>
                <p className="text-sm text-gray-500">{app.role}</p>
              </div>

              <select
                className="border p-2 rounded"
                value={app.status}
                onChange={async (e) => {
                  await updateStatus(app._id, e.target.value);
                  fetchData();
                }}
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