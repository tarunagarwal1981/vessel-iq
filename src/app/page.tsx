// src/app/page.tsx

import React from "react";
import Layout from "./layout";

const Page: React.FC = () => {
  return (
    <Layout>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Welcome to VesselIQ</h2>
        <p>Click the "Message Us" button to chat with us.</p>
      </div>
    </Layout>
  );
};

export default Page;
