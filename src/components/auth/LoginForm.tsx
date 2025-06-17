import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LoginCredentials } from "../../types";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const fillDemoCredentials = (role: "user" | "admin") => {
    if (role === "user") {
      setFormData({
        email: "john.doe@projectflow.com",
        password: "password123",
      });
    } else {
      setFormData({
        email: "admin@projectflow.com",
        password: "admin123",
      });
    }
    setError("");
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Demo Credentials */}
      <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
        <h3 className="text-sm font-medium text-secondary-700 mb-2">
          Demo Credentials:
        </h3>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => fillDemoCredentials("user")}
            className="block w-full text-left text-xs text-secondary-600 hover:text-primary-600 transition-colors"
          >
            👤 User: john.doe@projectflow.com / password123
          </button>
          <button
            type="button"
            onClick={() => fillDemoCredentials("admin")}
            className="block w-full text-left text-xs text-secondary-600 hover:text-primary-600 transition-colors"
          >
            👑 Admin: admin@projectflow.com / admin123
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-secondary-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="input-field pl-10 pr-10"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
              ) : (
                <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-destructive-600 bg-destructive-50 px-3 py-2 rounded-lg animate-slide-up">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="spinner" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Forgot Password Link */}
      <div className="mt-6 text-center">
        <button className="text-sm text-primary-600 hover:text-primary-500 transition-colors">
          Forgot your password?
        </button>
      </div>
    </div>
  );
};
