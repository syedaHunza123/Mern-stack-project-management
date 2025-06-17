import React from "react";
import { User } from "../../types";
import { AlertTriangle, X, Shield, ShieldCheck } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}) => {
  if (!isOpen || !user) return null;

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
                Delete User
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
            {/* User Info */}
            <div className="flex items-center space-x-4 mb-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-secondary-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-secondary-900">
                  {user.name}
                </h3>
                <p className="text-sm text-secondary-600">{user.email}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {user.role === "admin" ? (
                    <ShieldCheck className="h-3 w-3 text-primary-600" />
                  ) : (
                    <Shield className="h-3 w-3 text-secondary-600" />
                  )}
                  <span className="text-xs text-secondary-600 capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-secondary-600 mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-secondary-900">
                {user.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="bg-destructive-50 border border-destructive-200 rounded-lg p-3">
              <p className="text-sm text-destructive-700">
                <strong>Warning:</strong> This will permanently delete the user
                account and remove their access to the system.
                {user.role === "admin" && (
                  <span className="block mt-1">
                    <strong>Note:</strong> This user is an administrator with
                    elevated privileges.
                  </span>
                )}
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
                <span>Delete User</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
