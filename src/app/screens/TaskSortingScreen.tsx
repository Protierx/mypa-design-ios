import {
  ArrowLeft,
  Mic,
  Plus,
  MoreVertical,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  Trash2,
} from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState } from "react";

interface TaskSortingProps {
  onNavigate?: (screen: string) => void;
}

interface InboxItem {
  id: number;
  title: string;
  category: "now" | "today" | "later";
  dueTime?: string;
  estimatedTime?: string;
  isNew?: boolean;
  createdAt: string;
}

type TabType = "now" | "today" | "later";

export function TaskSortingScreen({ onNavigate }: TaskSortingProps) {
  const [activeTab, setActiveTab] = useState<TabType>("now");
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState<InboxItem[]>([
    {
      id: 1,
      title: "Call dentist for appointment",
      category: "now",
      dueTime: "2:00 PM",
      isNew: true,
      createdAt: "10m ago",
    },
    {
      id: 2,
      title: "Review Q1 metrics report",
      category: "now",
      estimatedTime: "15m",
      createdAt: "5m ago",
    },
    {
      id: 3,
      title: "Book flight for conference",
      category: "today",
      createdAt: "2h ago",
    },
    {
      id: 4,
      title: "Respond to Slack messages",
      category: "today",
      estimatedTime: "20m",
      isNew: true,
      createdAt: "1h ago",
    },
    {
      id: 5,
      title: "Learn new React patterns",
      category: "later",
      createdAt: "3h ago",
    },
    {
      id: 6,
      title: "Organize home office",
      category: "later",
      estimatedTime: "1h",
      createdAt: "5h ago",
    },
  ]);

  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [showAIHelper, setShowAIHelper] = useState(false);

  const filteredItems = items.filter((item) => item.category === activeTab);

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const newItem: InboxItem = {
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        title: inputValue,
        category: activeTab,
        isNew: true,
        createdAt: "now",
      };
      setItems([newItem, ...items]);
      setInputValue("");
    }
  };

  const handleDone = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    setShowMenuId(null);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    setShowMenuId(null);
  };

  const handleMoveCategory = (id: number, newCategory: TabType) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, category: newCategory } : item
      )
    );
    setShowMenuId(null);
  };

  const handleSnooze = (id: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, category: "later" } : item))
    );
    setShowMenuId(null);
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6]">
      <IOSStatusBar />

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#F9F8F6] border-b border-slate-100/50">
        <div className="px-6 pt-4 pb-4">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => onNavigate?.("hub")}
              className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-[28px] font-semibold text-slate-800">Sort</h1>
          </div>

          {/* Slogan */}
          <p className="text-[13px] text-slate-500 font-medium px-2 mb-4">
            ✅ Dump first, decide later.
          </p>

          {/* Segmented Control - Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-full max-w-full overflow-x-auto whitespace-nowrap">
            {(["now", "today", "later"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pt-5 pb-24">
        {/* Quick Capture Bar */}
        <div className="bg-white rounded-full px-5 py-3 shadow-sm border border-slate-100 flex items-center gap-3 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddItem();
              }
            }}
            placeholder="✅ Add anything… task, idea, reminder"
            className="flex-1 outline-none bg-transparent text-slate-800 placeholder:text-slate-400 text-[14px]"
          />
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddItem}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* AI Helper */}
        {filteredItems.length > 0 && (
          <button
            onClick={() => setShowAIHelper(true)}
            className="w-full mb-5 px-4 py-3 rounded-[16px] bg-purple-50 border border-purple-200 flex items-center justify-center gap-2 hover:bg-purple-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-[13px] font-medium text-purple-700">AI Sort → Turn this into missions</span>
          </button>
        )}

        {/* Content list */}
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-[18px] font-semibold text-slate-800 mb-2">✅ Your inbox is clear</h3>
            <p className="text-[14px] text-slate-500 mb-6 max-w-xs">Capture thoughts here. Plan them when you're ready.</p>
            <button
              onClick={() => {
                const input = document.querySelector("input[placeholder*='Add anything']") as HTMLInputElement;
                input?.focus();
              }}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[13px] font-semibold hover:opacity-90 transition-all"
            >
              Add your first item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="relative">
                <div className="bg-white rounded-[20px] p-5 shadow-sm border border-slate-100 flex items-start justify-between gap-4 hover:border-slate-200 transition-colors">
                  {item.isNew && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500" />}
                  <div className="flex-1 pr-6">
                    <h3 className="text-[15px] font-semibold text-slate-800 mb-2">{item.title}</h3>
                    {(item.dueTime || item.estimatedTime) && (
                      <div className="flex items-center gap-2">
                        {item.dueTime ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[12px] text-slate-500">{item.dueTime}</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[12px] text-slate-500">~{item.estimatedTime}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShowMenuId(showMenuId === item.id ? null : item.id)}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 flex-shrink-0"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {showMenuId === item.id && (
                      <div className="absolute right-0 top-10 bg-white rounded-lg shadow-lg border border-slate-200 z-50 min-w-max">
                        <button onClick={() => handleDone(item.id)} className="block w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Done
                        </button>
                        <button onClick={() => handleSnooze(item.id)} className="block w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100">Snooze</button>
                        <button className="block w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100">Add to Plan</button>
                        <button className="block w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100">Convert to Mission</button>
                        <button className="block w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100">Set Reminder</button>

                        <div className="border-t border-slate-100">
                          {(["now", "today", "later"] as const).map((cat) =>
                            cat !== item.category ? (
                              <button key={cat} onClick={() => handleMoveCategory(item.id, cat)} className="block w-full text-left px-4 py-3 text-[13px] text-slate-700 hover:bg-slate-50 border-b border-slate-100">Move to {cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
                            ) : null
                          )}
                        </div>

                        <button onClick={() => handleDelete(item.id)} className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAIHelper && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setShowAIHelper(false)} />
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto max-h-[80vh] overflow-y-auto" style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h2 className="text-[20px] font-semibold text-slate-800">AI Suggested Missions</h2>
              </div>
              <p className="text-[14px] text-slate-500 mb-5">Group your inbox items into focused missions</p>

              <div className="space-y-3 mb-6">
                <div className="bg-purple-50 border border-purple-200 rounded-[16px] p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1" />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-slate-800 mb-1">Communication & Wellness</p>
                      <p className="text-[12px] text-slate-600">Dentist appointment, Slack messages</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-slate-800 mb-1">Work Admin</p>
                      <p className="text-[12px] text-slate-600">Q1 metrics review, Book flight</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-[16px] p-4">
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-slate-800 mb-1">Learning & Growth</p>
                      <p className="text-[12px] text-slate-600">React patterns, Home office</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setShowAIHelper(false)} className="flex-1 px-4 py-3 rounded-full text-[14px] font-semibold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200">Cancel</button>
                <button className="flex-1 px-4 py-3 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[14px] font-semibold hover:opacity-90 transition-all">Create Missions</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
