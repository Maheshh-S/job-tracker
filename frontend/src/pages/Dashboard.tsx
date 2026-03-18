import { useEffect, useState } from "react";
import { updateStatus } from "../services/applicationService";
import {
  getApplications,
  createApplication,
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

    try {
      await createApplication({
        company,
        role,
        status,
        appliedDate,
      });

      // reset form
      setCompany("");
      setRole("");
      setStatus("Applied");
      setAppliedDate("");

      // refresh list
      fetchData();
    } catch (error) {
      console.error("Error creating application", error);
    }
  };

  return (
    <div>
      <div>
        <h3>Filter</h3>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All</option>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />

        <button onClick={fetchData}>Apply Filters</button>
      </div>

      <h2>Dashboard</h2>

      {/* FORM */}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />

        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <select
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
          value={appliedDate}
          onChange={(e) => setAppliedDate(e.target.value)}
        />

        <button type="submit">Add Application</button>
      </form>

      {/* LIST */}
      {applications.length === 0 ? (
        <p>No applications found</p>
      ) : (
        applications.map((app) => (
          <div key={app._id}>
            <p>{app.company}</p>
            <p>{app.role}</p>
            <select
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
  );
};

export default Dashboard;