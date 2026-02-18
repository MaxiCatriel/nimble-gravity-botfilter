import { useState } from "react";
import CandidateForm from "./components/CandidateForm";
import JobList from "./components/JobList";
import "./App.css";

export default function App() {
  const [candidate, setCandidate] = useState(null);

  return (
    <div className="container">
      <header className="header">
        <h1>Nimble Gravity — Bot Filter Challenge</h1>
        <p className="muted">
          React app: carga candidato por email, lista jobs y envía apply con repoUrl.
        </p>
      </header>

      <CandidateForm onCandidateLoaded={setCandidate} />
      <JobList candidate={candidate} />

      <footer className="footer muted">
        Tip: si algo falla, mirá el mensaje de error (la API suele devolverlo en el body).
      </footer>
    </div>
  );
}
