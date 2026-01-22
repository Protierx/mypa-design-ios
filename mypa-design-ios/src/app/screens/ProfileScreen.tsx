import { User, Users, ChevronRight, Settings, Bell, Lock, HelpCircle, LogOut, TrendingUp, Award, Calendar, Flame, Target, Zap, Crown, Star } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { MYPAOrb } from "../components/MYPAOrb";
import { useState } from "react";

interface ProfileScreenProps {
  onNavigate?: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // User stats and achievements
  const userStats = {
    level: 12,
    xp: 2460,
    xpToNext: 340,
    streak: 12,
    longestStreak: 21,
    timeSaved: '14h 20m',
    tasksCompleted: 247,
    challengesWon: 8,
    circlesJoined: 3,
  };

  const achievements = [
    { id: 1, name: 'Early Bird', emoji: '🌅', description: 'Complete 7 tasks before 9 AM', unlocked: true },
    { id: 2, name: 'Streak Master', emoji: '🔥', description: 'Maintain a 14-day streak', unlocked: true },
    { id: 3, name: 'Time Lord', emoji: '⏰', description: 'Save 10+ hours', unlocked: true },
    { id: 4, name: 'Social Butterfly', emoji: '🦋', description: 'Join 5 circles', unlocked: false, progress: 60 },
    { id: 5, name: 'Challenge Champion', emoji: '🏆', description: 'Win 10 challenges', unlocked: false, progress: 80 },
    { id: 6, name: 'Zen Master', emoji: '🧘', description: 'Complete all daily goals for a month', unlocked: false, progress: 40 },
  ];

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { id: 'edit-profile', label: 'Edit Profile', icon: User, color: 'from-blue-500 to-blue-600' },
        { id: 'privacy-controls', label: 'Privacy Controls', icon: Lock, color: 'from-purple-500 to-purple-600', highlighted: true },
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
    <div className="min-h-screen bg-ios-bg pb-28 relative overflow-hidden">
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .float { animation: float 3s ease-in-out infinite; }
      `}</style>
      
      {/* Ambient glows */}
      <div className="absolute top-32 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -left-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="px-5 pt-2 pb-4 relative z-10">
        <p className="text-[12px] text-slate-400 font-medium uppercase tracking-wider">Your Account</p>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight">Profile</h1>
      </div>

      <div className="px-4 space-y-4 relative z-10">
        {/* User Card - Dark elegant style like briefing card */}
        <div className="rounded-[24px] overflow-hidden shadow-xl relative" style={{ background: 'linear-gradient(145deg, var(--dark-card-start) 0%, var(--dark-card-middle) 50%, var(--dark-card-end) 100%)' }}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          
          <div className="p-5 relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <MYPAOrb size="sm" showGlow={false} />
                {/* Level Badge */}
                <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[10px] font-bold border-2 border-[#1a1a2e] shadow-lg">
                  Lvl {userStats.level}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[12px] text-white/50 mb-0.5">Welcome back,</p>
                <h2 className="text-[22px] font-bold text-white">Your Name</h2>
                <p className="text-[13px] text-white/50">user@email.com</p>
              </div>
              <button 
                onClick={() => setShowAchievements(true)}
                className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
              >
                <Crown className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* XP Progress */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-white/60">XP Progress</span>
                <span className="text-[12px] text-white/80 font-medium">{userStats.xpToNext} XP to Level {userStats.level + 1}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                  style={{ width: `${((userStats.xp % 500) / 500) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-[18px] font-bold text-white">{userStats.streak}</p>
                <p className="text-[10px] text-white/60">Streak</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-[18px] font-bold text-white">{userStats.circlesJoined}</p>
                <p className="text-[10px] text-white/60">Circles</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[18px] font-bold text-emerald-400">{userStats.timeSaved}</p>
                <p className="text-[10px] text-white/60">Saved</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="flex items-center justify-center mb-1">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-[18px] font-bold text-white">{userStats.challengesWon}</p>
                <p className="text-[10px] text-white/60">Wins</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="ios-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[22px] font-bold text-slate-900">{userStats.tasksCompleted}</p>
                <p className="text-[11px] text-slate-500">Tasks done</p>
              </div>
            </div>
          </div>
          <div className="ios-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-md">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[22px] font-bold text-slate-900">{userStats.longestStreak}</p>
                <p className="text-[11px] text-slate-500">Best streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="ios-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[15px] font-semibold text-slate-900">Recent Achievements</h3>
            <button 
              onClick={() => setShowAchievements(true)}
              className="text-[13px] font-medium text-purple-600"
            >
              View all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {achievements.filter(a => a.unlocked).slice(0, 4).map(achievement => (
              <div key={achievement.id} className="flex-shrink-0 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 mb-1">
                  {achievement.emoji}
                </div>
                <p className="text-[10px] text-slate-600 font-medium w-14 truncate">{achievement.name}</p>
              </div>
            ))}
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
                    onClick={() => onNavigate?.(item.id)}
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
        <button 
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full py-4 px-5 rounded-2xl bg-white text-red-500 text-[16px] font-semibold shadow-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        {/* Version */}
        <p className="text-[12px] text-slate-400 text-center pb-4">MYPA v1.0.0</p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <div className="w-full max-w-sm bg-white rounded-[28px] p-6 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-[20px] font-bold text-slate-800 mb-2">Log out?</h3>
                <p className="text-[14px] text-slate-500">Are you sure you want to log out of MYPA?</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3.5 rounded-full bg-slate-100 text-slate-700 text-[15px] font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    // In real app: clear auth state and redirect to login
                    onNavigate?.('hub');
                  }}
                  className="flex-1 py-3.5 rounded-full bg-red-500 text-white text-[15px] font-semibold hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Achievements Modal */}
      {showAchievements && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setShowAchievements(false)} />
          <div className="fixed inset-0 flex items-end z-50 pointer-events-none">
            <div className="w-full bg-white rounded-t-[32px] p-6 pointer-events-auto max-h-[80vh] overflow-y-auto" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.1)' }}>
              <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-bold text-slate-800">Achievements</h2>
                  <p className="text-[13px] text-slate-500">{achievements.filter(a => a.unlocked).length}/{achievements.length} unlocked</p>
                </div>
              </div>

              <div className="space-y-3">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`rounded-2xl p-4 border ${achievement.unlocked ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' 
                          : 'bg-slate-200'
                      }`}>
                        {achievement.unlocked ? achievement.emoji : '🔒'}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-[15px] font-semibold ${achievement.unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-[13px] text-slate-500">{achievement.description}</p>
                        {!achievement.unlocked && achievement.progress && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                style={{ width: `${achievement.progress}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{achievement.progress}% complete</p>
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowAchievements(false)}
                className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}