import { useState } from "react";
import { getCandidateByEmail } from "../api";

export default function CandidateForm({ onCandidateLoaded }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [candidate, setCandidate] = useState(null);

  const handleLoad = async () => {
    setError("");
    setCandidate(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Ingresá tu email.");
      return;
    }

    setLoading(true);
    try {
      const data = await getCandidateByEmail(trimmed);
      setCandidate(data);
      onCandidateLoaded?.(data);
    } catch (e) {
      setError(e?.message || "Error al obtener candidato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Step 2 — Obtener tus datos</h2>

      <div className="row">
        <input
          className="input"
          type="email"
          placeholder="tu.email@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button className="btn" onClick={handleLoad} disabled={loading}>
          {loading ? "Buscando..." : "Cargar candidato"}
        </button>
      </div>

      {error && <div className="alert error">{error}</div>}

      {candidate && (
        <div className="alert ok">
          <div>
            <b>OK</b> — {candidate.firstName} {candidate.lastName}
          </div>
          <div className="muted">
            uuid: {candidate.uuid} · candidateId: {candidate.candidateId}
          </div>
        </div>
      )}
    </div>
  );
}
