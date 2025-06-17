import React from "react";
import { Project } from "../../types";
import {
  Calendar,
  Users,
  MoreVertical,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Pause,
  Play,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onView?: (project: Project) => void;
}

const getStatusConfig = (status: Project["status"]) => {
  switch (status) {
    case "planning":
      return {
        label: "Planning",
        icon: Clock,
        className: "bg-warning-100 text-warning-700 border-warning-200",
        dotColor: "bg-warning-500",
      };
    case "in-progress":
      return {
        label: "In Progress",
        icon: Play,
        className: "bg-primary-100 text-primary-700 border-primary-200",
        dotColor: "bg-primary-500",
      };
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle,
        className: "bg-success-100 text-success-700 border-success-200",
        dotColor: "bg-success-500",
      };
    case "on-hold":
      return {
        label: "On Hold",
        icon: Pause,
        className: "bg-secondary-100 text-secondary-700 border-secondary-200",
        dotColor: "bg-secondary-500",
      };
  }
};

const getPriorityConfig = (priority: Project["priority"]) => {
  switch (priority) {
    case "low":
      return { label: "Low", className: "bg-secondary-100 text-secondary-700" };
    case "medium":
      return { label: "Medium", className: "bg-warning-100 text-warning-700" };
    case "high":
      return { label: "High", className: "bg-primary-100 text-primary-700" };
    case "urgent":
      return {
        label: "Urgent",
        className: "bg-destructive-100 text-destructive-700",
      };
  }
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onView,
}) => {
  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const StatusIcon = statusConfig.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue =
    project.endDate &&
    new Date(project.endDate) < new Date() &&
    project.status !== "completed";

  return (
    <div className="card-project group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors cursor-pointer line-clamp-2">
              {project.title}
            </h3>
            <p className="text-sm text-secondary-600 line-clamp-2">
              {project.description}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Toggle dropdown menu
                const dropdown = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (dropdown) {
                  dropdown.classList.toggle("hidden");
                }
              }}
              className="p-1 text-secondary-400 hover:text-secondary-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-card border border-secondary-200 py-1 z-10 hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(project);
                  // Hide dropdown
                  const dropdown = e.currentTarget.parentElement as HTMLElement;
                  dropdown?.classList.add("hidden");
                }}
                className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2"
              >
                <Edit className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView?.(project);
                  // Hide dropdown
                  const dropdown = e.currentTarget.parentElement as HTMLElement;
                  dropdown?.classList.add("hidden");
                }}
                className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50 flex items-center space-x-2"
              >
                <Eye className="h-3 w-3" />
                <span>View</span>
              </button>
              <hr className="my-1 border-secondary-100" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(project);
                  // Hide dropdown
                  const dropdown = e.currentTarget.parentElement as HTMLElement;
                  dropdown?.classList.add("hidden");
                }}
                className="w-full text-left px-3 py-2 text-sm text-destructive-600 hover:bg-destructive-50 flex items-center space-x-2"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center space-x-2 mb-4">
          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.className}`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusConfig.dotColor}`}
            />
            {statusConfig.label}
          </div>
          <div
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${priorityConfig.className}`}
          >
            {priorityConfig.label}
          </div>
          {isOverdue && (
            <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-destructive-100 text-destructive-700">
              <AlertCircle className="w-3 h-3 mr-1" />
              Overdue
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-secondary-600 mb-2">
            <span>Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-600 text-xs rounded-md">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200">
        <div className="flex items-center justify-between">
          {/* Left side - Team and dates */}
          <div className="flex items-center space-x-4 text-xs text-secondary-600">
            {/* Team members */}
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{project.teamMembers.length}</span>
            </div>

            {/* Due date */}
            {project.endDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(project.endDate)}</span>
              </div>
            )}

            {/* Budget */}
            {project.budget && (
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span>${project.budget.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Right side - Owner avatar */}
          <div className="flex items-center space-x-2">
            {project.owner.avatar ? (
              <img
                src={project.owner.avatar}
                alt={project.owner.name}
                className="w-6 h-6 rounded-full object-cover"
                title={project.owner.name}
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {project.owner.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
