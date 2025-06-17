import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { X, Mail, Shield, ShieldCheck, Upload } from "lucide-react";

interface UserFormData {
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User | null;
  isLoading?: boolean;
  mode: "create" | "edit";
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
  mode,
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "user",
    avatar: "",
  });

  const [emailError, setEmailError] = useState("");

  // Update form data when user changes (for edit mode)
  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        email: "",
        role: "user",
        avatar: "",
      });
    }
    setEmailError("");
  }, [user, mode, isOpen]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    // Validation
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter an email");
      return;
    }

    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email" && emailError) {
      setEmailError("");
    }
  };

  const handleAvatarUpload = () => {
    // Simulate avatar upload with random avatars
    const avatars = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    ];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    setFormData((prev) => ({
      ...prev,
      avatar: randomAvatar,
    }));
  };

  const handleClose = () => {
    setEmailError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-card animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200">
            <h2 className="text-xl font-semibold text-secondary-900">
              {mode === "create" ? "Add New User" : "Edit User"}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-secondary-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Avatar */}
            <div className="text-center">
              <div className="relative inline-block">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-secondary-200 flex items-center justify-center">
                    <span className="text-secondary-600 font-medium text-xl">
                      {formData.name.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleAvatarUpload}
                  className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                >
                  <Upload className="h-3 w-3 text-white" />
                </button>
              </div>
              <p className="text-xs text-secondary-600 mt-2">
                Click the upload icon to add a photo
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-secondary-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field pl-10 ${emailError ? "border-destructive-500" : ""}`}
                  placeholder="Enter email address"
                  required
                />
              </div>
              {emailError && (
                <p className="text-sm text-destructive-600 mt-1">
                  {emailError}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="user">User</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-xs text-secondary-600 mt-1">
                {formData.role === "admin"
                  ? "Administrators have full access to all features"
                  : "Users have access to their own projects and basic features"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-secondary-200">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>
                      {mode === "create" ? "Creating..." : "Updating..."}
                    </span>
                  </>
                ) : (
                  <span>
                    {mode === "create" ? "Create User" : "Update User"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
