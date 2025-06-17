import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface SidebarItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles: ("user" | "admin")[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["user", "admin"],
  },
  {
    id: "projects",
    name: "Projects",
    icon: FolderOpen,
    path: "/projects",
    roles: ["user", "admin"],
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: Calendar,
    path: "/calendar",
    roles: ["user", "admin"],
  },
  {
    id: "users",
    name: "Users",
    icon: Users,
    path: "/users",
    roles: ["admin"],
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    path: "/analytics",
    roles: ["admin"],
  },
  {
    id: "reports",
    name: "Reports",
    icon: FileText,
    path: "/reports",
    roles: ["user", "admin"],
  },
  {
    id: "messages",
    name: "Messages",
    icon: MessageSquare,
    path: "/messages",
    roles: ["user", "admin"],
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    path: "/settings",
    roles: ["user", "admin"],
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(user.role),
  );

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-secondary-200 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`sidebar-item w-full ${isActive ? "active" : ""}`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-primary-50 rounded-lg">
          <h3 className="text-sm font-medium text-primary-800 mb-2">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-primary-600">Active Projects</span>
              <span className="font-medium text-primary-800">3</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-primary-600">Completed</span>
              <span className="font-medium text-primary-800">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-primary-600">Total Tasks</span>
              <span className="font-medium text-primary-800">28</span>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
          <h3 className="text-sm font-medium text-secondary-800 mb-2">
            Need Help?
          </h3>
          <p className="text-xs text-secondary-600 mb-3">
            Check out our documentation or contact support.
          </p>
          <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
            View Documentation →
          </button>
        </div>
      </div>
    </aside>
  );
};
