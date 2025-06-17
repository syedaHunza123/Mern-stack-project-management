import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectContext";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  Users,
  Clock,
  DollarSign,
  Target,
} from "lucide-react";

interface ReportConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: "project" | "team" | "financial" | "timeline";
  color: string;
}

const availableReports: ReportConfig[] = [
  {
    id: "project-summary",
    name: "Project Summary Report",
    description:
      "Overview of all projects with status, progress, and key metrics",
    icon: BarChart3,
    type: "project",
    color: "bg-primary-100 text-primary-600",
  },
  {
    id: "team-performance",
    name: "Team Performance Report",
    description: "Individual and team productivity metrics and analysis",
    icon: Users,
    type: "team",
    color: "bg-success-100 text-success-600",
  },
  {
    id: "budget-analysis",
    name: "Budget Analysis Report",
    description: "Financial breakdown, budget utilization, and cost analysis",
    icon: DollarSign,
    type: "financial",
    color: "bg-warning-100 text-warning-600",
  },
  {
    id: "timeline-report",
    name: "Timeline & Milestones",
    description: "Project timelines, deadlines, and milestone achievements",
    icon: Clock,
    type: "timeline",
    color: "bg-secondary-100 text-secondary-600",
  },
  {
    id: "status-distribution",
    name: "Status Distribution",
    description: "Visual breakdown of project statuses and priority levels",
    icon: PieChart,
    type: "project",
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "completion-trends",
    name: "Completion Trends",
    description: "Historical analysis of project completion rates and patterns",
    icon: Target,
    type: "project",
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function Reports() {
  const { user } = useAuth();
  const { getUserProjects, getAllProjects } = useProjects();
  const [selectedReportType, setSelectedReportType] = useState<
    "all" | "project" | "team" | "financial" | "timeline"
  >("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const userProjects = getUserProjects();
  const allProjects = user?.role === "admin" ? getAllProjects() : userProjects;

  const filteredReports = availableReports.filter(
    (report) =>
      selectedReportType === "all" || report.type === selectedReportType,
  );

  const generateReport = async (reportId: string) => {
    setGeneratingReport(reportId);

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate report data based on type
    const report = availableReports.find((r) => r.id === reportId);
    if (report) {
      // Here you would normally generate actual report data
      const reportData = {
        title: report.name,
        generatedAt: new Date().toISOString(),
        projects: allProjects,
        summary: `Generated ${report.name} with ${allProjects.length} projects analyzed.`,
      };

      // For demo, show success message
      alert(
        `${report.name} generated successfully!\n\nSummary: ${reportData.summary}`,
      );
    }

    setGeneratingReport(null);
  };

  const downloadReport = (
    reportId: string,
    format: "pdf" | "excel" | "csv",
  ) => {
    const report = availableReports.find((r) => r.id === reportId);
    if (report) {
      // For demo purposes, just show a message
      alert(`Downloading ${report.name} as ${format.toUpperCase()}...`);
    }
  };

  const getQuickStats = () => {
    const totalProjects = allProjects.length;
    const completedProjects = allProjects.filter(
      (p) => p.status === "completed",
    ).length;
    const activeProjects = allProjects.filter(
      (p) => p.status === "in-progress",
    ).length;
    const overduePlProjects = allProjects.filter(
      (p) =>
        p.endDate &&
        new Date(p.endDate) < new Date() &&
        p.status !== "completed",
    ).length;

    return {
      total: totalProjects,
      completed: completedProjects,
      active: activeProjects,
      overdue: overduePlProjects,
      completionRate:
        totalProjects > 0
          ? Math.round((completedProjects / totalProjects) * 100)
          : 0,
    };
  };

  const stats = getQuickStats();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Reports</h1>
          <p className="text-secondary-600 mt-1">
            Generate detailed reports and export your data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule Report</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export All</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-project p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {stats.total}
            </div>
            <div className="text-sm text-secondary-600">Total Projects</div>
          </div>
        </div>
        <div className="card-project p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {stats.completed}
            </div>
            <div className="text-sm text-secondary-600">Completed</div>
          </div>
        </div>
        <div className="card-project p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {stats.active}
            </div>
            <div className="text-sm text-secondary-600">Active</div>
          </div>
        </div>
        <div className="card-project p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive-600">
              {stats.overdue}
            </div>
            <div className="text-sm text-secondary-600">Overdue</div>
          </div>
        </div>
        <div className="card-project p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.completionRate}%
            </div>
            <div className="text-sm text-secondary-600">Completion Rate</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={selectedReportType}
          onChange={(e) =>
            setSelectedReportType(e.target.value as typeof selectedReportType)
          }
          className="input-field w-auto"
        >
          <option value="all">All Report Types</option>
          <option value="project">Project Reports</option>
          <option value="team">Team Reports</option>
          <option value="financial">Financial Reports</option>
          <option value="timeline">Timeline Reports</option>
        </select>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
            className="input-field w-auto"
            placeholder="Start Date"
          />
          <span className="text-secondary-600">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
            className="input-field w-auto"
            placeholder="End Date"
          />
        </div>

        <button className="btn-secondary flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>More Filters</span>
        </button>
      </div>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const Icon = report.icon;
          const isGenerating = generatingReport === report.id;

          return (
            <div key={report.id} className="card-project p-6">
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${report.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {report.name}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-4">
                    {report.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => generateReport(report.id)}
                      disabled={isGenerating}
                      className="btn-primary text-sm flex items-center space-x-1 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <div className="spinner" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="h-3 w-3" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>

                    <div className="relative group">
                      <button className="btn-secondary text-sm flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>

                      {/* Download Dropdown */}
                      <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-card border border-secondary-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                          onClick={() => downloadReport(report.id, "pdf")}
                          className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        >
                          PDF
                        </button>
                        <button
                          onClick={() => downloadReport(report.id, "excel")}
                          className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        >
                          Excel
                        </button>
                        <button
                          onClick={() => downloadReport(report.id, "csv")}
                          className="w-full text-left px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        >
                          CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="card-project p-6">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Recent Reports
        </h3>
        <div className="space-y-3">
          {[
            {
              name: "Project Summary Report",
              date: "2024-02-15",
              type: "PDF",
              size: "2.3 MB",
            },
            {
              name: "Team Performance Report",
              date: "2024-02-10",
              type: "Excel",
              size: "1.8 MB",
            },
            {
              name: "Budget Analysis Report",
              date: "2024-02-05",
              type: "PDF",
              size: "1.2 MB",
            },
          ].map((report, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-secondary-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-secondary-900">
                    {report.name}
                  </div>
                  <div className="text-xs text-secondary-600">
                    Generated on {new Date(report.date).toLocaleDateString()} •{" "}
                    {report.type} • {report.size}
                  </div>
                </div>
              </div>
              <button className="p-1 hover:bg-secondary-100 rounded">
                <Download className="h-4 w-4 text-secondary-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
