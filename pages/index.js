// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the API URL from the environment variable
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>VesselIQ Data</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error}</p>
      ) : data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
