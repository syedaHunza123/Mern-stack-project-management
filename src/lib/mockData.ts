import { User, Project, DashboardStats } from "../types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@projectflow.com",
    name: "John Doe",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    email: "admin@projectflow.com",
    name: "Sarah Admin",
    role: "admin",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-01-10T08:00:00Z",
  },
  {
    id: "3",
    email: "jane.smith@projectflow.com",
    name: "Jane Smith",
    role: "user",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-12T08:00:00Z",
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform Redesign",
    description:
      "Complete overhaul of the existing e-commerce platform with modern UI/UX design, improved performance, and mobile-first approach.",
    status: "in-progress",
    priority: "high",
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2024-04-30T00:00:00Z",
    ownerId: "1",
    owner: mockUsers[0],
    teamMembers: [mockUsers[0], mockUsers[2]],
    progress: 65,
    budget: 85000,
    tags: ["frontend", "react", "design", "e-commerce"],
    createdAt: "2024-01-28T08:00:00Z",
    updatedAt: "2024-02-15T14:30:00Z",
  },
  {
    id: "2",
    title: "Mobile App Development",
    description:
      "Native mobile application for iOS and Android platforms with real-time synchronization and offline capabilities.",
    status: "planning",
    priority: "medium",
    startDate: "2024-03-15T00:00:00Z",
    endDate: "2024-08-15T00:00:00Z",
    ownerId: "1",
    owner: mockUsers[0],
    teamMembers: [mockUsers[0]],
    progress: 10,
    budget: 120000,
    tags: ["mobile", "react-native", "ios", "android"],
    createdAt: "2024-02-10T08:00:00Z",
    updatedAt: "2024-02-10T08:00:00Z",
  },
  {
    id: "3",
    title: "API Integration & Documentation",
    description:
      "Comprehensive API documentation and integration with third-party services including payment gateways and analytics.",
    status: "completed",
    priority: "medium",
    startDate: "2024-01-01T00:00:00Z",
    endDate: "2024-02-01T00:00:00Z",
    ownerId: "3",
    owner: mockUsers[2],
    teamMembers: [mockUsers[2]],
    progress: 100,
    budget: 45000,
    tags: ["backend", "api", "documentation", "integration"],
    createdAt: "2023-12-20T08:00:00Z",
    updatedAt: "2024-02-01T16:00:00Z",
  },
  {
    id: "4",
    title: "Data Analytics Dashboard",
    description:
      "Real-time analytics dashboard with interactive charts, KPI tracking, and automated reporting capabilities.",
    status: "on-hold",
    priority: "low",
    startDate: "2024-04-01T00:00:00Z",
    ownerId: "3",
    owner: mockUsers[2],
    teamMembers: [mockUsers[2]],
    progress: 25,
    budget: 60000,
    tags: ["analytics", "dashboard", "charts", "reporting"],
    createdAt: "2024-02-05T08:00:00Z",
    updatedAt: "2024-02-20T10:15:00Z",
  },
  {
    id: "5",
    title: "Security Audit & Compliance",
    description:
      "Comprehensive security audit, vulnerability assessment, and implementation of compliance standards.",
    status: "in-progress",
    priority: "urgent",
    startDate: "2024-02-20T00:00:00Z",
    endDate: "2024-03-20T00:00:00Z",
    ownerId: "1",
    owner: mockUsers[0],
    teamMembers: [mockUsers[0], mockUsers[2]],
    progress: 40,
    budget: 35000,
    tags: ["security", "audit", "compliance", "infrastructure"],
    createdAt: "2024-02-15T08:00:00Z",
    updatedAt: "2024-02-25T11:45:00Z",
  },
];

export const getMockDashboardStats = (
  userId: string,
  userRole: "user" | "admin",
): DashboardStats => {
  if (userRole === "admin") {
    return {
      totalProjects: mockProjects.length,
      activeProjects: mockProjects.filter((p) => p.status === "in-progress")
        .length,
      completedProjects: mockProjects.filter((p) => p.status === "completed")
        .length,
      totalUsers: mockUsers.length,
    };
  } else {
    const userProjects = mockProjects.filter((p) => p.ownerId === userId);
    return {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter((p) => p.status === "in-progress")
        .length,
      completedProjects: userProjects.filter((p) => p.status === "completed")
        .length,
    };
  }
};

export const getProjectsByUser = (
  userId: string,
  userRole: "user" | "admin",
): Project[] => {
  if (userRole === "admin") {
    return mockProjects;
  }
  return mockProjects.filter((p) => p.ownerId === userId);
};

// Mock credentials for demo
export const mockCredentials = {
  user: { email: "john.doe@projectflow.com", password: "password123" },
  admin: { email: "admin@projectflow.com", password: "admin123" },
};
