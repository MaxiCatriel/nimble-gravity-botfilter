const BASE_URL =
  "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

async function parseError(res) {
  try {
    const data = await res.json();
    return (
      data?.message ||
      data?.error ||
      data?.errors?.[0]?.message ||
      JSON.stringify(data)
    );
  } catch {
    try {
      return await res.text();
    } catch {
      return `HTTP ${res.status}`;
    }
  }
}

export async function getCandidateByEmail(email) {
  const url = new URL(`${BASE_URL}/api/candidate/get-by-email`);
  url.searchParams.set("email", email);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function getJobsList() {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`);
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}

export async function applyToJob({ uuid, candidateId, applicationId, jobId, repoUrl }) {
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uuid, candidateId, applicationId, jobId, repoUrl }),
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res.json();
}
