// src/app/page.tsx

import React, { useState } from "react";
import Layout from "./layout";
import Chat from "../components/Chat"; // Correct path to Chat component

const Page: React.FC = () => {
  const [response, setResponse] = useState("");

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <h2>VesselIQ Response</h2>
          <p>Welcome to VesselIQ! You can ask about:</p>
          <ul>
            <li>Vessel performance scores</li>
            <li>Hull condition analysis</li>
            <li>Speed consumption profiles</li>
            <li>Crew performance metrics</li>
            <li>Engine troubleshooting</li>
          </ul>
          <p>{response}</p>
          <Chat setResponse={setResponse} />
        </div>
      </div>
    </Layout>
  );
};

export default Page;
