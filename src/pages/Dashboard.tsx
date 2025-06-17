import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectContext";
import { DashboardStats, Project, ProjectFormData } from "../types";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectModal } from "../components/projects/ProjectModal";
import { ProjectEditModal } from "../components/projects/ProjectEditModal";
import { DeleteConfirmModal } from "../components/projects/DeleteConfirmModal";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Users,
  Plus,
  Calendar,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    getUserProjects,
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!user) return;

    // Get user's projects
    const userProjects = getUserProjects();
    const allProjects = getAllProjects();

    // Calculate stats
    const dashboardStats: DashboardStats = {
      totalProjects: userProjects.length,
      activeProjects: userProjects.filter((p) => p.status === "in-progress")
        .length,
      completedProjects: userProjects.filter((p) => p.status === "completed")
        .length,
      ...(user.role === "admin" && { totalUsers: 3 }), // Mock user count for admin
    };

    // Get 3 most recent projects
    const recent = userProjects
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);

    setStats(dashboardStats);
    setRecentProjects(recent);
  }, [user, getUserProjects, getAllProjects]);

  const handleScheduleMeeting = () => {
    // For demo purposes, show a scheduling interface
    const meetingTitle = prompt("Enter meeting title:");
    if (meetingTitle) {
      const meetingDate = prompt("Enter meeting date (YYYY-MM-DD):");
      if (meetingDate) {
        const meetingTime = prompt("Enter meeting time (HH:MM):");
        if (meetingTime) {
          // In a real app, this would integrate with calendar API
          alert(
            `Meeting "${meetingTitle}" scheduled for ${meetingDate} at ${meetingTime}!\n\nThis would typically:\n- Add to calendar\n- Send invitations\n- Create meeting room\n- Set reminders`,
          );

          // Could also navigate to calendar page
          // navigate('/calendar');
        }
      }
    }
  };

  const handleInviteTeamMember = () => {
    // For demo purposes, show invitation interface
    const memberEmail = prompt("Enter team member's email address:");
    if (memberEmail) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(memberEmail)) {
        const memberRole = confirm(
          "Should this member be an admin?\n\nClick OK for Admin, Cancel for Regular User",
        );
        const role = memberRole ? "admin" : "user";

        // In a real app, this would send invitation email
        alert(
          `Invitation sent to ${memberEmail} as ${role}!\n\nThis would typically:\n- Send invitation email\n- Create pending user account\n- Set up access permissions\n- Notify current team members`,
        );

        // Could also navigate to users page
        // navigate('/users');
      } else {
        alert("Please enter a valid email address.");
      }
    }
  };

  if (!user || !stats) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded mb-6 w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-secondary-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleCreateProject = async (projectData: ProjectFormData) => {
    try {
      const newProject = await createProject(projectData);

      // Show success message
      alert(`Project "${newProject.title}" created successfully!`);

      setShowProjectModal(false);

      // The useEffect will automatically update the stats and recent projects
      // because getUserProjects() will return the updated list
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const handleViewProject = (project: Project) => {
    // For now, just show an alert. Later you could navigate to a detailed view
    alert(`Viewing project: ${project.title}`);
  };

  const handleUpdateProject = async (formData: ProjectFormData) => {
    if (!selectedProject) return;

    try {
      await updateProject(selectedProject.id, formData);
      alert(`Project "${formData.title}" updated successfully!`);
      setShowEditModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await deleteProject(selectedProject.id);
      alert(`Project "${selectedProject.title}" deleted successfully!`);
      setShowDeleteModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            {getGreeting()}, {user.name}! 👋
          </h1>
          <p className="text-secondary-600 mt-1">
            Here's what's happening with your projects today.
          </p>
        </div>
        <button
          onClick={() => setShowProjectModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.totalProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600">+12% from last month</span>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Active Projects</p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.activeProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-secondary-600">Currently in progress</span>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-secondary-900">
                {stats.completedProjects}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-secondary-600">This quarter</span>
          </div>
        </div>

        {user.role === "admin" && stats.totalUsers && (
          <div className="card-project p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
              <span className="text-success-600">+3 new this week</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Recent Projects */}
          <div className="card-project p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-secondary-900">
                Recent Projects
              </h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEditProject}
                    onDelete={handleDeleteProject}
                    onView={handleViewProject}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  No projects yet
                </h3>
                <p className="text-secondary-600 mb-4">
                  Get started by creating your first project.
                </p>
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="btn-primary"
                >
                  Create Project
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card-project p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowProjectModal(true)}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-secondary-700">
                  Create Project
                </span>
              </button>

              <button
                onClick={handleScheduleMeeting}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-warning-600" />
                </div>
                <span className="text-sm font-medium text-secondary-700">
                  Schedule Meeting
                </span>
              </button>

              <button
                onClick={handleInviteTeamMember}
                className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-success-600" />
                </div>
                <span className="text-sm font-medium text-secondary-700">
                  Invite Team Member
                </span>
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="card-project p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Upcoming Deadlines
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg">
                <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    E-commerce Platform
                  </p>
                  <p className="text-xs text-secondary-600">Due in 3 days</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900 truncate">
                    Security Audit
                  </p>
                  <p className="text-xs text-secondary-600">Due in 1 week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleCreateProject}
        isLoading={false}
      />

      {/* Project Edit Modal */}
      <ProjectEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        onSubmit={handleUpdateProject}
        project={selectedProject}
        isLoading={false}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        onConfirm={handleConfirmDelete}
        project={selectedProject}
        isLoading={false}
      />
    </div>
  );
}
