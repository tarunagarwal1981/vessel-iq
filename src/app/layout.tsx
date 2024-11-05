// src/components/Layout.tsx
import Chat from "./Chat";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      {children}
      <Chat />
    </div>
  );
};

export default Layout;
