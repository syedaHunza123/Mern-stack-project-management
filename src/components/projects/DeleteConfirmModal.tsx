import React from "react";
import { Project } from "../../types";
import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  project: Project | null;
  isLoading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  project,
  isLoading = false,
}) => {
  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-card animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-destructive-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive-600" />
              </div>
              <h2 className="text-lg font-semibold text-secondary-900">
                Delete Project
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-secondary-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-secondary-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-secondary-900">
                "{project.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="bg-destructive-50 border border-destructive-200 rounded-lg p-3">
              <p className="text-sm text-destructive-700">
                <strong>Warning:</strong> This will permanently delete the
                project and all associated data.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-secondary-200">
            <button
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-destructive-600 hover:bg-destructive-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Project</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
