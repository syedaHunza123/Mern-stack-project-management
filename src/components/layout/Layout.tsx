import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
};
