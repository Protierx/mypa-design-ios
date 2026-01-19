import { User, Users, ChevronRight, Settings, Bell, Lock, HelpCircle, LogOut, TrendingUp, Award, Calendar } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { MYPAOrb } from "../components/MYPAOrb";

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Edit Profile', icon: User, color: 'from-blue-500 to-blue-600' },
        { id: 'privacy', label: 'Privacy Controls', icon: Lock, color: 'from-purple-500 to-purple-600', highlighted: true },
        { id: 'notifications', label: 'Notifications', icon: Bell, color: 'from-orange-400 to-orange-500' },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help & Support', icon: HelpCircle, color: 'from-emerald-500 to-emerald-600' },
        { id: 'settings', label: 'App Settings', icon: Settings, color: 'from-slate-500 to-slate-600' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-28 relative">
      <IOSStatusBar />
      
      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
        }
        .ios-card:active {
          transform: scale(0.98);
          transition: transform 0.15s ease;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
      
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Profile</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* User Card - Dark elegant style like briefing card */}
        <div className="rounded-[24px] overflow-hidden shadow-xl" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <MYPAOrb size="sm" showGlow={false} />
              </div>
              <div>
                <h2 className="text-[20px] font-bold text-white">Your Name</h2>
                <p className="text-[14px] text-white/60">user@email.com</p>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-[22px] font-bold text-white">3</p>
                <p className="text-[11px] text-white/60 font-medium">Circles</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-[22px] font-bold text-white">12</p>
                <p className="text-[11px] text-white/60 font-medium">Day Streak</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[22px] font-bold text-emerald-400">+2h</p>
                <p className="text-[11px] text-white/60 font-medium">Saved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Quick Info */}
        <div className="ios-card p-4 shadow-sm border border-purple-100/50">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md shadow-purple-500/20">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-slate-900">Privacy Mode</h3>
              <p className="text-[13px] text-slate-500">
                Sharing: <span className="font-medium text-purple-600">Metrics only</span>
              </p>
            </div>
            <button 
              onClick={() => onNavigate?.('privacy-controls')}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-2 px-1">
              {group.title}
            </h2>
            <div className="ios-card overflow-hidden shadow-sm">
              {group.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => item.id === 'privacy' ? onNavigate?.('privacy-controls') : undefined}
                    className={`w-full flex items-center justify-between p-4 active:bg-slate-50 transition-colors ${
                      itemIndex < group.items.length - 1 ? 'border-b border-slate-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[16px] font-medium text-slate-900">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button className="w-full py-4 px-5 rounded-2xl bg-white text-red-500 text-[16px] font-semibold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* Version */}
        <p className="text-[12px] text-slate-400 text-center pb-4">MYPA v1.0.0</p>
      </div>
    </div>
  );
}