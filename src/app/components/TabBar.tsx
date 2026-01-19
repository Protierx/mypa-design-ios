import {
  Inbox,
  Users,
  User,
  LayoutGrid,
} from "lucide-react";
import { MYPAOrb } from "./MYPAOrb";

interface TabBarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onVoiceClick?: () => void;
}

const tabs = [
  { id: "hub", label: "Hub", icon: LayoutGrid, gradient: "from-purple-500 to-purple-600" },
  { id: "inbox", label: "Inbox", icon: Inbox, gradient: "from-blue-500 to-cyan-500" },
  { id: "circles", label: "Circles", icon: Users, gradient: "from-pink-500 to-rose-500" },
  { id: "profile", label: "Profile", icon: User, gradient: "from-emerald-500 to-teal-500" },
];

export function TabBar({
  activeTab = "hub",
  onTabChange,
  onVoiceClick,
}: TabBarProps) {
  return (
    <div className="absolute left-0 right-0 bottom-0 z-50 pointer-events-none">
      <div className="relative mx-auto max-w-[390px] w-full pointer-events-auto">
        {/* Premium frosted glass background */}
        <div 
          className="absolute inset-x-3 bottom-3 h-[72px] rounded-[24px] overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.92) 100%)',
            boxShadow: '0 -4px 30px rgba(181, 140, 255, 0.15), 0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.6)',
          }}
        />

        <div className="relative px-4 pb-5 pt-3 flex items-center justify-between z-10">
          {/* Left tabs */}
          {tabs.slice(0, 2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1.5 active:scale-90 transition-all duration-200"
              >
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${tab.gradient} shadow-lg` 
                    : 'bg-transparent hover:bg-slate-100'
                }`}
                style={isActive ? {
                  boxShadow: tab.id === 'hub' 
                    ? '0 4px 14px rgba(168, 85, 247, 0.4)' 
                    : '0 4px 14px rgba(59, 130, 246, 0.4)'
                } : {}}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive ? "text-white" : "text-slate-600"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold transition-all duration-200 ${
                    isActive 
                      ? "text-slate-800" 
                      : "text-slate-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* Center Voice Orb - MYPA Orb */}
          <button
            onClick={onVoiceClick}
            className="relative mx-2 active:scale-95 transition-all duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <MYPAOrb size="sm" showGlow={false} />
            </div>
          </button>

          {/* Right tabs */}
          {tabs.slice(2).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1.5 active:scale-90 transition-all duration-200"
              >
                <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-br ${tab.gradient} shadow-lg` 
                    : 'bg-transparent hover:bg-slate-100'
                }`}
                style={isActive ? {
                  boxShadow: tab.id === 'circles' 
                    ? '0 4px 14px rgba(236, 72, 153, 0.4)' 
                    : '0 4px 14px rgba(16, 185, 129, 0.4)'
                } : {}}
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive ? "text-white" : "text-slate-600"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold transition-all duration-200 ${
                    isActive 
                      ? "text-slate-800" 
                      : "text-slate-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}