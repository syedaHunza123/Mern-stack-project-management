import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { mockUsers } from "../lib/mockData";
import { User } from "../types";
import { UserModal } from "../components/users/UserModal";
import { DeleteUserModal } from "../components/users/DeleteUserModal";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Shield,
  ShieldCheck,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";

interface UserFormData {
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | "user" | "admin">(
    "all",
  );
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isLoading, setIsLoading] = useState(false);

  // Load users from localStorage or use mock data
  useEffect(() => {
    const storedUsers = localStorage.getItem("projectflow_users");
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers([...mockUsers, ...parsedUsers]);
      } catch (error) {
        console.error("Error loading stored users:", error);
        setUsers(mockUsers);
      }
    } else {
      setUsers(mockUsers);
    }
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    const userCreatedUsers = users.filter(
      (u) => !mockUsers.find((mu) => mu.id === u.id),
    );
    localStorage.setItem("projectflow_users", JSON.stringify(userCreatedUsers));
  }, [users]);

  // Filter users based on search and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role === "user").length,
    activeToday: Math.floor(users.length * 0.7), // Mock active users
  };

  const getRoleIcon = (role: "user" | "admin") => {
    return role === "admin" ? (
      <ShieldCheck className="h-4 w-4 text-primary-600" />
    ) : (
      <Shield className="h-4 w-4 text-secondary-600" />
    );
  };

  const getRoleBadge = (role: "user" | "admin") => {
    return role === "admin"
      ? "bg-primary-100 text-primary-700"
      : "bg-secondary-100 text-secondary-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddUser = () => {
    setModalMode("create");
    setSelectedUser(null);
    setShowUserModal(true);
  };

  const handleEditUser = (userToEdit: User) => {
    setModalMode("edit");
    setSelectedUser(userToEdit);
    setShowUserModal(true);
  };

  const handleDeleteUser = (userToDelete: User) => {
    setSelectedUser(userToDelete);
    setShowDeleteModal(true);
  };

  const handleUserSubmit = async (formData: UserFormData) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (modalMode === "create") {
        // Check if email already exists
        const emailExists = users.some((u) => u.email === formData.email);
        if (emailExists) {
          alert("A user with this email already exists!");
          setIsLoading(false);
          return;
        }

        // Create new user
        const newUser: User = {
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: formData.avatar,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setUsers((prev) => [newUser, ...prev]);
        alert(`User "${newUser.name}" created successfully!`);
      } else if (modalMode === "edit" && selectedUser) {
        // Check if email already exists (excluding current user)
        const emailExists = users.some(
          (u) => u.email === formData.email && u.id !== selectedUser.id,
        );
        if (emailExists) {
          alert("A user with this email already exists!");
          setIsLoading(false);
          return;
        }

        // Update existing user
        const updatedUser: User = {
          ...selectedUser,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          avatar: formData.avatar,
          updatedAt: new Date().toISOString(),
        };

        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? updatedUser : u)),
        );
        alert(`User "${updatedUser.name}" updated successfully!`);
      }

      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if trying to delete the current user
      if (selectedUser.id === user?.id) {
        alert("You cannot delete your own account!");
        setIsLoading(false);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      alert(`User "${selectedUser.name}" deleted successfully!`);

      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-destructive-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-destructive-600" />
          </div>
          <h1 className="text-xl font-semibold text-secondary-900 mb-2">
            Access Denied
          </h1>
          <p className="text-secondary-600">
            Only administrators can access user management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            User Management
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <button
          onClick={handleAddUser}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-secondary-900">
                {userStats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Administrators</p>
              <p className="text-2xl font-bold text-secondary-900">
                {userStats.admins}
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Regular Users</p>
              <p className="text-2xl font-bold text-secondary-900">
                {userStats.regularUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Active Today</p>
              <p className="text-2xl font-bold text-secondary-900">
                {userStats.activeToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) =>
              setSelectedRole(e.target.value as "all" | "user" | "admin")
            }
            className="input-field w-auto min-w-[120px]"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>

        <button className="btn-secondary flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="card-project overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-secondary-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-secondary-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-secondary-900">
                          {u.name}
                        </div>
                        <div className="text-sm text-secondary-600 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}
                    >
                      {getRoleIcon(u.role)}
                      <span className="ml-1 capitalize">{u.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-success-100 text-success-700">
                      <div className="w-1.5 h-1.5 bg-success-500 rounded-full mr-1"></div>
                      Online
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="p-1 hover:bg-secondary-100 rounded text-secondary-600 hover:text-secondary-800"
                        title="Edit user"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-1 hover:bg-destructive-100 rounded text-secondary-600 hover:text-destructive-600"
                        title="Delete user"
                        disabled={u.id === user?.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-secondary-100 rounded text-secondary-600 hover:text-secondary-800">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              No users found
            </h3>
            <p className="text-secondary-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUserSubmit}
        user={selectedUser}
        mode={modalMode}
        isLoading={isLoading}
      />

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={isLoading}
      />
    </div>
  );
}
