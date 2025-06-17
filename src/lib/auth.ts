import { LoginCredentials, User } from "../types";
import { mockUsers, mockCredentials } from "./mockData";

const AUTH_TOKEN_KEY = "projectflow_auth_token";
const AUTH_USER_KEY = "projectflow_auth_user";

// Mock JWT-like token generation
const generateMockToken = (user: User): string => {
  return btoa(
    JSON.stringify({
      userId: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    }),
  );
};

// Mock token validation
const validateMockToken = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

// Mock authentication API calls
export const authAPI = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<{ user: User; token: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check credentials
    let user: User | null = null;

    if (
      credentials.email === mockCredentials.user.email &&
      credentials.password === mockCredentials.user.password
    ) {
      user =
        mockUsers.find((u) => u.email === mockCredentials.user.email) || null;
    } else if (
      credentials.email === mockCredentials.admin.email &&
      credentials.password === mockCredentials.admin.password
    ) {
      user =
        mockUsers.find((u) => u.email === mockCredentials.admin.email) || null;
    }

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const token = generateMockToken(user);

    // Store in localStorage for persistence
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    return { user, token };
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userStr = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !userStr) return null;

    if (!validateMockToken(token)) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return token ? validateMockToken(token) : false;
  },
};

// Route protection utilities
export const requireAuth = (user: User | null): boolean => {
  return user !== null;
};

export const requireRole = (
  user: User | null,
  requiredRole: "user" | "admin",
): boolean => {
  if (!user) return false;
  return user.role === requiredRole || user.role === "admin"; // Admin can access user routes
};

export const getRedirectPath = (user: User): string => {
  return "/dashboard";
};
