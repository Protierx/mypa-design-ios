import {
  ArrowLeft,
  MoreVertical,
  Trash2,
  CheckCircle,
  MessageSquare,
  Bell,
  Users,
  Heart,
  Clock,
  X,
  ChevronRight,
} from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState } from "react";

interface InboxScreenProps {
  onNavigate?: (screen: string) => void;
}

interface Assignment {
  id: number;
  title: string;
  assignedByName: string;
  dueTime?: string;
  status: "pending" | "accepted" | "completed" | "declined";
}

type TabType = "all" | "messages" | "reminders" | "invites";

interface NotificationItem {
  id: number;
  title: string;
  subtitle?: string;
  type: "message" | "reminder" | "invite" | "social";
  time: string;
  isNew?: boolean;
}

export function InboxScreen({ onNavigate }: InboxScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  
  // Assignments assigned to you
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 1,
      title: "Review Q1 metrics",
      assignedByName: "Alex",
      dueTime: "2:00 PM",
      status: "pending",
    },
    {
      id: 2,
      title: "Grocery run",
      assignedByName: "Blake",
      dueTime: "6:00 PM",
      status: "pending",
    },
  ]);

  const [items, setItems] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Alice sent you a message",
      subtitle: "Can we reschedule our call to Thursday?",
      type: "message",
      time: "10m ago",
      isNew: true,
    },
    {
      id: 2,
      title: "Reminder: Take medication",
      subtitle: "Daily 8:00 AM",
      type: "reminder",
      time: "1h ago",
    },
    {
      id: 3,
      title: "Circle invite from Dev Team",
      subtitle: "Join the Q1 planning circle",
      type: "invite",
      time: "2h ago",
      isNew: true,
    },
  ]);

  const [menuId, setMenuId] = useState<number | null>(null);
  const [assignMenuId, setAssignMenuId] = useState<number | null>(null);

  const filtered = items.filter((it) =>
    activeTab === "all"
      ? true
      : activeTab === "messages"
      ? it.type === "message"
      : activeTab === "reminders"
      ? it.type === "reminder"
      : activeTab === "invites"
      ? it.type === "invite"
      : true
  );

  const markRead = (id: number) => {
    setItems(items.map((it) => (it.id === id ? { ...it, isNew: false } : it)));
    setMenuId(null);
  };

  const remove = (id: number) => {
    setItems(items.filter((it) => it.id !== id));
    setMenuId(null);
  };

  const updateAssignmentStatus = (id: number, status: "accepted" | "completed" | "declined") => {
    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, status } : a))
    );
    setAssignMenuId(null);
  };

  const iconFor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "reminder":
        return <Bell className="w-5 h-5 text-amber-600" />;
      case "invite":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "social":
        return <Heart className="w-5 h-5 text-pink-600" />;
    }
  };

  const iconBgFor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "message":
        return "bg-blue-100";
      case "reminder":
        return "bg-amber-100";
      case "invite":
        return "bg-purple-100";
      case "social":
        return "bg-pink-100";
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "accepted":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "declined":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getAssignmentStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "completed":
        return "Done";
      case "declined":
        return "Declined";
      default:
        return status;
    }
  };

  const newCount = items.filter(i => i.isNew).length;

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-28 relative">
      <IOSStatusBar />

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 16px;
        }
        .ios-card:active {
          transform: scale(0.98);
          transition: transform 0.15s ease;
        }
      `}</style>

      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Inbox</h1>
          </div>
          {newCount > 0 && (
            <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[12px] font-semibold text-red-600">{newCount} new</span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-3">
          {(["all", "messages", "reminders", "invites"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                activeTab === tab
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {tab === "all" ? "All" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Assigned to You Section */}
        {assignments.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
                Assigned to you
              </h2>
              <span className="text-[12px] font-medium text-slate-400">{assignments.length} tasks</span>
            </div>
            <div className="space-y-2.5">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="ios-card p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold text-slate-900">
                          {assignment.title}
                        </h3>
                        <p className="text-[13px] text-slate-500 mt-0.5">
                          From <span className="font-medium text-slate-600">{assignment.assignedByName}</span>
                        </p>
                        {assignment.dueTime && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getAssignmentStatusColor(assignment.status)}`}>
                              {getAssignmentStatusLabel(assignment.status)}
                            </span>
                            <span className="text-[12px] text-slate-400">• Due {assignment.dueTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() =>
                          setAssignMenuId(
                            assignMenuId === assignment.id ? null : assignment.id
                          )
                        }
                        className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {assignMenuId === assignment.id && (
                        <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[140px] overflow-hidden">
                          {assignment.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateAssignmentStatus(assignment.id, "accepted")}
                                className="block w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateAssignmentStatus(assignment.id, "declined")}
                                className="block w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {assignment.status === "accepted" && (
                            <button
                              onClick={() => updateAssignmentStatus(assignment.id, "completed")}
                              className="block w-full text-left px-4 py-3 text-[14px] font-medium text-emerald-600 hover:bg-emerald-50"
                            >
                              Mark done
                            </button>
                          )}
                          {(assignment.status === "completed" || assignment.status === "declined") && (
                            <button
                              onClick={() => {
                                setAssignments(assignments.filter((a) => a.id !== assignment.id));
                                setAssignMenuId(null);
                              }}
                              className="block w-full text-left px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Inbox Items */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">
              Notifications
            </h2>
          </div>
          
          {filtered.length === 0 ? (
            <div className="ios-card p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-[17px] font-semibold text-slate-900 mb-1">
                You're all caught up
              </h3>
              <p className="text-[14px] text-slate-500 max-w-[200px]">
                New messages and updates will appear here
              </p>
            </div>
          ) : (
            <div className="ios-card overflow-hidden shadow-sm">
              {filtered.map((it, index) => (
                <div
                  key={it.id}
                  className={`p-4 flex items-start gap-3 ${
                    index < filtered.length - 1 ? "border-b border-slate-100" : ""
                  } ${it.isNew ? "bg-purple-50/50" : ""}`}
                >
                  <div className={`w-11 h-11 rounded-2xl ${iconBgFor(it.type)} flex items-center justify-center flex-shrink-0`}>
                    {iconFor(it.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-semibold text-slate-900">
                          {it.title}
                        </h3>
                        {it.subtitle && (
                          <p className="text-[13px] text-slate-500 mt-0.5 truncate">
                            {it.subtitle}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {it.isNew && (
                          <div className="w-2 h-2 rounded-full bg-purple-500" />
                        )}
                        <span className="text-[12px] text-slate-400">{it.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setMenuId(menuId === it.id ? null : it.id)}
                      className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {menuId === it.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 min-w-[140px] overflow-hidden">
                        {it.isNew && (
                          <button
                            onClick={() => markRead(it.id)}
                            className="block w-full text-left px-4 py-3 text-[14px] font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => remove(it.id)}
                          className="block w-full text-left px-4 py-3 text-[14px] font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}