import { useEffect, useState } from "react";
import { getApplications } from "../services/applicationService";

const Dashboard = () => {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getApplications();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

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