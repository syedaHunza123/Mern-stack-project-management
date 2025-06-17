export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  priority: "low" | "medium" | "high" | "urgent";
  startDate: string;
  endDate?: string;
  ownerId: string;
  owner: User;
  teamMembers: User[];
  progress: number; // 0-100
  budget?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assigneeId?: string;
  assignee?: User;
  projectId: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalUsers?: number; // Only for admins
}

export interface ProjectFormData {
  title: string;
  description: string;
  status: Project["status"];
  priority: Project["priority"];
  startDate: string;
  endDate?: string;
  budget?: number;
  tags: string[];
}

export interface ProjectFilters {
  status?: Project["status"];
  priority?: Project["priority"];
  search?: string;
  sortBy?: "title" | "createdAt" | "startDate" | "priority";
  sortOrder?: "asc" | "desc";
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  type: "direct" | "group";
  participants?: string[];
}
