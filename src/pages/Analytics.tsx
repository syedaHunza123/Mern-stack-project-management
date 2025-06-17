import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectContext";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Target,
  DollarSign,
  Activity,
} from "lucide-react";

interface AnalyticsData {
  projectsByStatus: { status: string; count: number; percentage: number }[];
  projectsByPriority: { priority: string; count: number; color: string }[];
  monthlyProgress: { month: string; completed: number; started: number }[];
  teamProductivity: { name: string; projects: number; completion: number }[];
  budgetAnalysis: { allocated: number; spent: number; remaining: number };
}

export default function Analytics() {
  const { user } = useAuth();
  const { getAllProjects } = useProjects();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d",
  );

  useEffect(() => {
    const projects = getAllProjects();

    // Calculate analytics data
    const statusData = [
      {
        status: "Planning",
        count: projects.filter((p) => p.status === "planning").length,
        percentage: 0,
      },
      {
        status: "In Progress",
        count: projects.filter((p) => p.status === "in-progress").length,
        percentage: 0,
      },
      {
        status: "Completed",
        count: projects.filter((p) => p.status === "completed").length,
        percentage: 0,
      },
      {
        status: "On Hold",
        count: projects.filter((p) => p.status === "on-hold").length,
        percentage: 0,
      },
    ];

    // Calculate percentages
    const totalProjects = projects.length;
    statusData.forEach((item) => {
      item.percentage =
        totalProjects > 0 ? Math.round((item.count / totalProjects) * 100) : 0;
    });

    const priorityData = [
      {
        priority: "Low",
        count: projects.filter((p) => p.priority === "low").length,
        color: "bg-secondary-400",
      },
      {
        priority: "Medium",
        count: projects.filter((p) => p.priority === "medium").length,
        color: "bg-warning-400",
      },
      {
        priority: "High",
        count: projects.filter((p) => p.priority === "high").length,
        color: "bg-primary-400",
      },
      {
        priority: "Urgent",
        count: projects.filter((p) => p.priority === "urgent").length,
        color: "bg-destructive-400",
      },
    ];

    // Mock monthly data
    const monthlyData = [
      { month: "Jan", completed: 2, started: 3 },
      { month: "Feb", completed: 4, started: 2 },
      { month: "Mar", completed: 1, started: 4 },
      { month: "Apr", completed: 3, started: 1 },
      { month: "May", completed: 2, started: 3 },
      { month: "Jun", completed: 5, started: 2 },
    ];

    // Mock team data
    const teamData = [
      { name: "John Doe", projects: 3, completion: 85 },
      { name: "Jane Smith", projects: 2, completion: 92 },
      { name: "Sarah Admin", projects: 4, completion: 78 },
    ];

    // Calculate budget analysis
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const spentBudget = Math.round(totalBudget * 0.65); // Mock spent amount
    const budgetData = {
      allocated: totalBudget,
      spent: spentBudget,
      remaining: totalBudget - spentBudget,
    };

    setAnalytics({
      projectsByStatus: statusData,
      projectsByPriority: priorityData,
      monthlyProgress: monthlyData,
      teamProductivity: teamData,
      budgetAnalysis: budgetData,
    });
  }, [getAllProjects]);

  if (user?.role !== "admin") {
    return (
      <div className="p-6">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-destructive-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-destructive-600" />
          </div>
          <h1 className="text-xl font-semibold text-secondary-900 mb-2">
            Access Denied
          </h1>
          <p className="text-secondary-600">
            Only administrators can access analytics.
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-secondary-200 rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-secondary-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics</h1>
          <p className="text-secondary-600 mt-1">
            Project insights and performance metrics
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          className="input-field w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-secondary-900">
                {analytics.projectsByStatus.reduce(
                  (sum, item) => sum + item.count,
                  0,
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600">+15% from last month</span>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-secondary-900">
                {analytics.projectsByStatus.find(
                  (s) => s.status === "Completed",
                )?.percentage || 0}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-success-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
            <span className="text-success-600">+8% from last month</span>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">
                Team Productivity
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {Math.round(
                  analytics.teamProductivity.reduce(
                    (sum, t) => sum + t.completion,
                    0,
                  ) / analytics.teamProductivity.length,
                )}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-warning-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="h-4 w-4 text-destructive-500 mr-1" />
            <span className="text-destructive-600">-2% from last month</span>
          </div>
        </div>

        <div className="card-project p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-600 mb-1">
                Budget Utilization
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {analytics.budgetAnalysis.allocated > 0
                  ? Math.round(
                      (analytics.budgetAnalysis.spent /
                        analytics.budgetAnalysis.allocated) *
                        100,
                    )
                  : 0}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-secondary-600">
              ${analytics.budgetAnalysis.spent.toLocaleString()} spent
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Chart */}
        <div className="card-project p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Projects by Status
          </h3>
          <div className="space-y-4">
            {analytics.projectsByStatus.map((item) => (
              <div
                key={item.status}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "Planning"
                        ? "bg-warning-400"
                        : item.status === "In Progress"
                          ? "bg-primary-400"
                          : item.status === "Completed"
                            ? "bg-success-400"
                            : "bg-secondary-400"
                    }`}
                  />
                  <span className="text-sm text-secondary-700">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-secondary-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === "Planning"
                          ? "bg-warning-400"
                          : item.status === "In Progress"
                            ? "bg-primary-400"
                            : item.status === "Completed"
                              ? "bg-success-400"
                              : "bg-secondary-400"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-secondary-900 w-8">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card-project p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Priority Distribution
          </h3>
          <div className="space-y-4">
            {analytics.projectsByPriority.map((item) => (
              <div
                key={item.priority}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-secondary-700">
                    {item.priority}
                  </span>
                </div>
                <span className="text-sm font-medium text-secondary-900">
                  {item.count} projects
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="card-project p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Monthly Progress
          </h3>
          <div className="space-y-3">
            {analytics.monthlyProgress.map((month) => (
              <div
                key={month.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-secondary-700 w-12">
                  {month.month}
                </span>
                <div className="flex items-center space-x-4 flex-1 ml-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-success-400 rounded-full" />
                    <span className="text-xs text-secondary-600">
                      {month.completed} completed
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-400 rounded-full" />
                    <span className="text-xs text-secondary-600">
                      {month.started} started
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="card-project p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Team Performance
          </h3>
          <div className="space-y-4">
            {analytics.teamProductivity.map((member) => (
              <div key={member.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-900">
                    {member.name}
                  </span>
                  <span className="text-sm text-secondary-600">
                    {member.completion}%
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${member.completion}%` }}
                  />
                </div>
                <div className="text-xs text-secondary-600">
                  {member.projects} active projects
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="card-project p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Budget Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              ${analytics.budgetAnalysis.allocated.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Total Allocated</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600 mb-1">
              ${analytics.budgetAnalysis.spent.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              ${analytics.budgetAnalysis.remaining.toLocaleString()}
            </div>
            <div className="text-sm text-secondary-600">Remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
