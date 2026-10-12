import { useEffect, useState } from "react";

type Health = { status: string };

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Health>;
      })
      .then(setHealth)
      .catch((err: unknown) => setError(String(err)));
  }, []);

  return (
    <main>
      <h1>Web</h1>
      <p>
        API status:{" "}
        {error ? `unreachable (${error})` : (health?.status ?? "checking…")}
      </p>
    </main>
  );
}

export default App;
