import { useEffect, useState } from "react";
import { getJobsList } from "../api";
import JobCard from "./JobCard";

export default function JobList({ candidate }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getJobsList();
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.message || "Error al cargar jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="card">
      <div className="row spaceBetween">
        <h2>Step 3 & 4 — Posiciones abiertas</h2>
        <button className="btn secondary" onClick={loadJobs} disabled={loading}>
          {loading ? "Cargando..." : "Refrescar"}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}
      {loading && <div className="muted">Cargando posiciones...</div>}

      {!loading && jobs.length === 0 && !error && (
        <div className="muted">No hay posiciones para mostrar.</div>
      )}

      <div className="jobsGrid">
        {jobs.map((j) => (
          <JobCard key={j.id} job={j} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
