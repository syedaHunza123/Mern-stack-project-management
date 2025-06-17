import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Camera,
  Check,
  AlertCircle,
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    teamMessages: false,
    deadlineReminders: true,
    weeklyReports: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  });

  const [userAvatar, setUserAvatar] = useState(user?.avatar || "");

  // Load saved settings from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem(
      "projectflow_notifications",
    );
    const savedPreferences = localStorage.getItem("projectflow_preferences");

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }

    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error("Error loading preferences:", error);
      }
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", preferences.theme);
  }, [preferences.theme]);

  // Show success/error messages temporarily
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "preferences", name: "Preferences", icon: Palette },
    { id: "data", name: "Data & Privacy", icon: Database },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate form
      if (!formData.name.trim()) {
        setErrorMessage("Name is required");
        return;
      }

      if (!formData.email.trim()) {
        setErrorMessage("Email is required");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage("Please enter a valid email address");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to localStorage (in real app, this would be API call)
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        avatar: userAvatar,
      };
      localStorage.setItem(
        "projectflow_user_profile",
        JSON.stringify(updatedUser),
      );

      setSuccessMessage("Profile updated successfully!");

      // Reset password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem(
        "projectflow_notifications",
        JSON.stringify(notifications),
      );

      setSuccessMessage("Notification preferences updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save to localStorage
      localStorage.setItem(
        "projectflow_preferences",
        JSON.stringify(preferences),
      );

      setSuccessMessage("Preferences updated successfully!");
    } catch (error) {
      setErrorMessage("Failed to update preferences. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Validate passwords
      if (!formData.currentPassword) {
        setErrorMessage("Current password is required");
        return;
      }

      if (!formData.newPassword) {
        setErrorMessage("New password is required");
        return;
      }

      if (formData.newPassword.length < 8) {
        setErrorMessage("New password must be at least 8 characters long");
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMessage("New passwords do not match");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccessMessage("Password updated successfully!");

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    try {
      const exportData = {
        profile: { name: formData.name, email: formData.email },
        notifications,
        preferences,
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `projectflow-settings-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage("Data exported successfully!");
    } catch (error) {
      setErrorMessage("Failed to export data. Please try again.");
    }
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);

          if (importData.notifications) {
            setNotifications(importData.notifications);
            localStorage.setItem(
              "projectflow_notifications",
              JSON.stringify(importData.notifications),
            );
          }

          if (importData.preferences) {
            setPreferences(importData.preferences);
            localStorage.setItem(
              "projectflow_preferences",
              JSON.stringify(importData.preferences),
            );
          }

          setSuccessMessage("Data imported successfully!");
        } catch (error) {
          setErrorMessage(
            "Invalid file format. Please select a valid export file.",
          );
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.\n\nType 'DELETE' to confirm:",
    );

    if (confirmDelete) {
      const confirmation = window.prompt(
        "Type 'DELETE' to confirm account deletion:",
      );
      if (confirmation === "DELETE") {
        alert(
          "Account deletion feature would be implemented with proper backend integration.",
        );
      } else {
        alert("Account deletion cancelled.");
      }
    }
  };

  const handleAvatarUpload = () => {
    // Create file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image must be smaller than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select a valid image file");
        return;
      }

      // Convert to base64 for demo (in real app, you'd upload to server)
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target?.result as string;
        setUserAvatar(imageDataUrl);
        setSuccessMessage(
          "Profile photo updated! Click 'Save Changes' to save.",
        );
      };

      reader.onerror = () => {
        setErrorMessage("Error reading image file");
      };

      reader.readAsDataURL(file);
    };

    // Trigger file selector
    input.click();
  };

  const handleRandomAvatar = () => {
    // For demo purposes, use random avatars
    const avatars = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    ];

    const currentIndex = avatars.findIndex((avatar) => avatar === userAvatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    const randomAvatar = avatars[nextIndex];

    setUserAvatar(randomAvatar);
    setSuccessMessage("Profile photo updated! Click 'Save Changes' to save.");
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Profile Information
        </h3>

        {/* Avatar */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-secondary-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center border-2 border-secondary-200">
                <span className="text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button
              onClick={handleAvatarUpload}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-lg border-2 border-white"
              title="Upload new photo"
            >
              <Camera className="h-4 w-4 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-secondary-900 mb-2">
              Profile Photo
            </h4>
            <p className="text-sm text-secondary-600 mb-3">
              Click the camera icon to upload your photo, or try a random avatar
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAvatarUpload}
                className="btn-secondary text-xs"
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload Photo
              </button>
              <button
                onClick={handleRandomAvatar}
                className="btn-secondary text-xs"
              >
                🎲 Random Avatar
              </button>
              {userAvatar && (
                <button
                  onClick={() => {
                    setUserAvatar("");
                    setSuccessMessage(
                      "Profile photo removed! Click 'Save Changes' to save.",
                    );
                  }}
                  className="text-xs text-destructive-600 hover:text-destructive-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveProfile}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-secondary-900">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </div>
                <div className="text-sm text-secondary-600">
                  {key === "emailNotifications" &&
                    "Receive email notifications for important updates"}
                  {key === "projectUpdates" &&
                    "Get notified when projects are updated"}
                  {key === "teamMessages" &&
                    "Receive notifications for team messages"}
                  {key === "deadlineReminders" &&
                    "Get reminded about upcoming deadlines"}
                  {key === "weeklyReports" && "Receive weekly progress reports"}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    handleNotificationChange(key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSaveNotifications}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Password & Security
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-secondary-400" />
                ) : (
                  <Eye className="h-4 w-4 text-secondary-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mt-6">
          <h4 className="text-sm font-medium text-warning-800 mb-2">
            Password Requirements
          </h4>
          <ul className="text-sm text-warning-700 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Include at least one uppercase letter</li>
            <li>• Include at least one number</li>
            <li>• Include at least one special character</li>
          </ul>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleUpdatePassword}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Two-Factor Authentication
        </h3>
        <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-secondary-900">
                Two-Factor Authentication
              </div>
              <div className="text-sm text-secondary-600">
                Add an extra layer of security to your account
              </div>
            </div>
            <button className="btn-secondary">Enable 2FA</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Application Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Theme
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => handlePreferenceChange("theme", e.target.value)}
              className="input-field"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) =>
                handlePreferenceChange("language", e.target.value)
              }
              className="input-field"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) =>
                handlePreferenceChange("timezone", e.target.value)
              }
              className="input-field"
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">Greenwich Mean Time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Date Format
            </label>
            <select
              value={preferences.dateFormat}
              onChange={(e) =>
                handlePreferenceChange("dateFormat", e.target.value)
              }
              className="input-field"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSavePreferences}
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="spinner" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Data Management
        </h3>

        <div className="space-y-4">
          <div className="card-project p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-secondary-900">
                  Export Data
                </h4>
                <p className="text-sm text-secondary-600">
                  Download all your data in JSON format
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="card-project p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-secondary-900">
                  Import Data
                </h4>
                <p className="text-sm text-secondary-600">
                  Upload data from a previous export
                </p>
              </div>
              <button
                onClick={handleImportData}
                className="btn-secondary flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Danger Zone
        </h3>

        <div className="bg-destructive-50 border border-destructive-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-destructive-900">
                Delete Account
              </h4>
              <p className="text-sm text-destructive-600">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="bg-destructive-600 hover:bg-destructive-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
          <p className="text-secondary-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-center space-x-2 animate-slide-up">
            <Check className="h-5 w-5 text-success-600" />
            <span className="text-success-700">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 bg-destructive-50 border border-destructive-200 rounded-lg flex items-center space-x-2 animate-slide-up">
            <AlertCircle className="h-5 w-5 text-destructive-600" />
            <span className="text-destructive-700">{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                        : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="card-project p-6">
              {activeTab === "profile" && renderProfileTab()}
              {activeTab === "notifications" && renderNotificationsTab()}
              {activeTab === "security" && renderSecurityTab()}
              {activeTab === "preferences" && renderPreferencesTab()}
              {activeTab === "data" && renderDataTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
