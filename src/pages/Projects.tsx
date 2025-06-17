import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Grid, List } from "lucide-react";
import { ProjectModal } from "../components/projects/ProjectModal";
import { ProjectEditModal } from "../components/projects/ProjectEditModal";
import { DeleteConfirmModal } from "../components/projects/DeleteConfirmModal";
import { ProjectCard } from "../components/projects/ProjectCard";
import { useProjects } from "../contexts/ProjectContext";
import { ProjectFormData, Project } from "../types";

export default function Projects() {
  const { getUserProjects, createProject, updateProject, deleteProject } =
    useProjects();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [userProjects, setUserProjects] = useState<Project[]>([]);

  useEffect(() => {
    const projects = getUserProjects();
    setUserProjects(projects);
  }, [getUserProjects]);

  const handleCreateProject = async (projectData: ProjectFormData) => {
    try {
      const newProject = await createProject(projectData);
      alert(`Project "${newProject.title}" created successfully!`);
      setShowProjectModal(false);

      // Refresh the projects list
      const updatedProjects = getUserProjects();
      setUserProjects(updatedProjects);
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

      // Refresh the projects list
      const updatedProjects = getUserProjects();
      setUserProjects(updatedProjects);
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

      // Refresh the projects list
      const updatedProjects = getUserProjects();
      setUserProjects(updatedProjects);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Projects</h1>
          <p className="text-secondary-600 mt-1">
            Manage and track all your projects in one place.
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

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-6 space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <button className="btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 bg-secondary-100 rounded-lg p-1">
          <button className="p-2 rounded-md bg-white shadow-sm">
            <Grid className="h-4 w-4 text-secondary-600" />
          </button>
          <button className="p-2 rounded-md">
            <List className="h-4 w-4 text-secondary-400" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {userProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
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
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold">PF</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            No Projects Yet
          </h2>
          <p className="text-secondary-600 mb-6 max-w-md mx-auto">
            Start by creating your first project. You can add project details,
            set priorities, and track progress.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setShowProjectModal(true)}
              className="btn-primary"
            >
              Create First Project
            </button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      )}

      {/* Feature Preview */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-project p-6 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Plus className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Create Projects
          </h3>
          <p className="text-sm text-secondary-600">
            Easily create and organize your projects with custom fields and
            settings.
          </p>
        </div>

        <div className="card-project p-6 text-center">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Filter className="h-6 w-6 text-warning-600" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Advanced Filters
          </h3>
          <p className="text-sm text-secondary-600">
            Filter projects by status, priority, team members, and more.
          </p>
        </div>

        <div className="card-project p-6 text-center">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Grid className="h-6 w-6 text-success-600" />
          </div>
          <h3 className="text-lg font-medium text-secondary-900 mb-2">
            Multiple Views
          </h3>
          <p className="text-sm text-secondary-600">
            Switch between grid and list views to see your projects the way you
            want.
          </p>
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
