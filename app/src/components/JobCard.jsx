import { useMemo, useState } from "react";
import { applyToJob } from "../api";

function looksLikeGithubUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    return u.hostname.toLowerCase().includes("github.com") && parts.length >= 2;
  } catch {
    return false;
  }
}

export default function JobCard({ job, candidate }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const canSubmit = useMemo(() => {
    if (!candidate?.uuid || !candidate?.candidateId) return false;
    const trimmed = repoUrl.trim();
    return trimmed && looksLikeGithubUrl(trimmed);
  }, [candidate, repoUrl]);

  const handleSubmit = async () => {
    setMsg("");
    setErr("");

    if (!candidate?.uuid || !candidate?.candidateId) {
      setErr("Primero cargá tu candidato (Step 2).");
      return;
    }

    const trimmed = repoUrl.trim();
    if (!looksLikeGithubUrl(trimmed)) {
      setErr("Ingresá una URL válida de GitHub (ej: https://github.com/usuario/repo).");
      return;
    }

    setSubmitting(true);
    try {
      const res = await applyToJob({
        uuid: candidate.uuid,
        candidateId: candidate.candidateId,
        applicationId: candidate.applicationId,
        jobId: job.id,
        repoUrl: trimmed,
      });

      if (res?.ok) setMsg("¡Postulación enviada! (ok: true)");
      else setMsg(`Respuesta: ${JSON.stringify(res)}`);
    } catch (e) {
      setErr(e?.message || "Error al enviar postulación.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job">
      <div className="jobHeader">
        <div>
          <div className="jobTitle">{job.title}</div>
          <div className="muted">jobId: {job.id}</div>
        </div>
      </div>

      <div className="row">
        <input
          className="input"
          placeholder="https://github.com/tu-usuario/tu-repo"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          disabled={submitting}
        />
        <button className="btn" onClick={handleSubmit} disabled={submitting || !canSubmit}>
          {submitting ? "Enviando..." : "Submit"}
        </button>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}
    </div>
  );
}
