import { useEffect, useState } from "react";
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

  const fetchData = async () => {
    try {
      const data = await getApplications();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications", error);
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
            <p>{app.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;