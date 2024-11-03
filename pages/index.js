// pages/index.js

import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
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
        <p>Error: {error}</p>
      ) : (
        data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>
      )}
    </div>
  );
}
