import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProjects } from "../contexts/ProjectContext";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "project" | "meeting" | "deadline";
  projectId?: string;
  color: string;
}

export default function Calendar() {
  const { user } = useAuth();
  const { getUserProjects } = useProjects();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Generate events from projects
    const projects = getUserProjects();
    const projectEvents: CalendarEvent[] = [];

    projects.forEach((project) => {
      // Add project start date
      projectEvents.push({
        id: `start-${project.id}`,
        title: `${project.title} - Start`,
        date: project.startDate,
        time: "09:00",
        type: "project",
        projectId: project.id,
        color: "bg-primary-500",
      });

      // Add project end date if exists
      if (project.endDate) {
        projectEvents.push({
          id: `end-${project.id}`,
          title: `${project.title} - Deadline`,
          date: project.endDate,
          time: "17:00",
          type: "deadline",
          projectId: project.id,
          color: "bg-destructive-500",
        });
      }
    });

    // Add some sample meetings
    const today = new Date();
    const sampleEvents: CalendarEvent[] = [
      {
        id: "meeting-1",
        title: "Team Standup",
        date: today.toISOString().split("T")[0],
        time: "10:00",
        type: "meeting",
        color: "bg-success-500",
      },
      {
        id: "meeting-2",
        title: "Client Review",
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        time: "14:00",
        type: "meeting",
        color: "bg-warning-500",
      },
    ];

    setEvents([...projectEvents, ...sampleEvents]);
  }, [getUserProjects]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startDate; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((event) => event.date === dateStr);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Calendar</h1>
          <p className="text-secondary-600 mt-1">
            Manage your project deadlines and meetings
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 card-project p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-medium text-secondary-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-24 p-1" />;
              }

              const dayEvents = getEventsForDate(date);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`h-24 p-1 border border-secondary-200 cursor-pointer hover:bg-secondary-50 transition-colors ${
                    isTodayDate ? "bg-primary-50" : ""
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isTodayDate ? "text-primary-600" : "text-secondary-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded text-white truncate ${event.color}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-secondary-500">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="card-project p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Upcoming Events
            </h3>
            <div className="space-y-3">
              {events
                .filter((event) => new Date(event.date) >= new Date())
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime(),
                )
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-2 hover:bg-secondary-50 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${event.color}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary-900 truncate">
                        {event.title}
                      </p>
                      <div className="flex items-center text-xs text-secondary-600 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(event.date).toLocaleDateString()} at{" "}
                        {event.time}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Legend */}
          <div className="card-project p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Legend
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary-500 rounded-full" />
                <span className="text-sm text-secondary-700">
                  Project Start
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive-500 rounded-full" />
                <span className="text-sm text-secondary-700">Deadline</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full" />
                <span className="text-sm text-secondary-700">Meeting</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning-500 rounded-full" />
                <span className="text-sm text-secondary-700">Review</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-project p-4">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              This Month
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Total Events</span>
                <span className="text-sm font-medium">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Meetings</span>
                <span className="text-sm font-medium">
                  {events.filter((e) => e.type === "meeting").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-secondary-600">Deadlines</span>
                <span className="text-sm font-medium">
                  {events.filter((e) => e.type === "deadline").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
