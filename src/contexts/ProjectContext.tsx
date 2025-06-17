import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, ProjectFormData } from "../types";
import { mockProjects, mockUsers } from "../lib/mockData";
import { useAuth } from "./AuthContext";

interface ProjectContextType {
  projects: Project[];
  isLoading: boolean;
  createProject: (data: ProjectFormData) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  getUserProjects: () => Project[];
  getAllProjects: () => Project[];
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load projects on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("projectflow_projects");
    if (storedProjects) {
      try {
        const parsedProjects = JSON.parse(storedProjects);
        setProjects([...mockProjects, ...parsedProjects]);
      } catch (error) {
        console.error("Error loading stored projects:", error);
        setProjects(mockProjects);
      }
    } else {
      setProjects(mockProjects);
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    const userCreatedProjects = projects.filter(
      (p) => !mockProjects.find((mp) => mp.id === p.id),
    );
    localStorage.setItem(
      "projectflow_projects",
      JSON.stringify(userCreatedProjects),
    );
  }, [projects]);

  const createProject = async (data: ProjectFormData): Promise<Project> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Generate new project ID
      const newId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create new project
      const newProject: Project = {
        id: newId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        ownerId: user.id,
        owner: user,
        teamMembers: [user], // Start with just the creator
        progress: data.status === "completed" ? 100 : 0,
        budget: data.budget,
        tags: data.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to projects list
      setProjects((prev) => [newProject, ...prev]);

      return newProject;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (
    id: string,
    data: Partial<Project>,
  ): Promise<Project> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedProject = {
        ...projects.find((p) => p.id === id)!,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p)),
      );

      return updatedProject;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProjects = (): Project[] => {
    if (!user) return [];
    if (user.role === "admin") return projects;
    return projects.filter((p) => p.ownerId === user.id);
  };

  const getAllProjects = (): Project[] => {
    return projects;
  };

  const value: ProjectContextType = {
    projects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    getUserProjects,
    getAllProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
