import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-100 opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-secondary-200 opacity-20 blur-3xl"></div>
      </div>

      <div className="relative text-center max-w-lg">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-gradient mb-4 animate-fade-in">
            404
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="glass-card p-8 animate-slide-up">
          <h1 className="text-2xl font-bold text-secondary-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-secondary-600 mb-8">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </button>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-secondary-500 mb-4">
            Need help? Try these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/projects")}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="text-primary-600 hover:text-primary-700 transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
