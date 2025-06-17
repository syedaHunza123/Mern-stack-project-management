import React from "react";
import { LoginForm } from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-200 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="glass-card p-8 animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">PF</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gradient mb-2">
              ProjectFlow
            </h1>
            <p className="text-secondary-600">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-secondary-500">
              © 2024 ProjectFlow. All rights reserved.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 text-center">
          <div
            className="glass-card p-4 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <h3 className="text-sm font-medium text-secondary-800 mb-1">
              Role-Based Access
            </h3>
            <p className="text-xs text-secondary-600">
              Secure authentication with user and admin roles
            </p>
          </div>
          <div
            className="glass-card p-4 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-sm font-medium text-secondary-800 mb-1">
              Project Management
            </h3>
            <p className="text-xs text-secondary-600">
              Create, manage, and track your projects efficiently
            </p>
          </div>
          <div
            className="glass-card p-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-sm font-medium text-secondary-800 mb-1">
              Real-time Collaboration
            </h3>
            <p className="text-xs text-secondary-600">
              Work together with your team in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
