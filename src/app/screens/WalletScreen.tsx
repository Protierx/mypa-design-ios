import { ArrowLeft, Clock, Sparkles, TrendingUp, Gift, ChevronRight } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState } from "react";

interface WalletScreenProps {
  onNavigate?: (screen: string) => void;
}

export function WalletScreen({ onNavigate }: WalletScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('week');
  
  const stats = {
    today: { saved: '42m', tasks: 8, streak: 6 },
    week: { saved: '2h 40m', tasks: 34, streak: 6 },
    month: { saved: '12h 20m', tasks: 142, streak: 6 },
  };

  const recentSaves = [
    { id: 1, action: 'Completed "Morning workout" early', time: '+15m', when: '2h ago', icon: '🏃' },
    { id: 2, action: 'Batched 3 errands together', time: '+12m', when: '4h ago', icon: '📦' },
    { id: 3, action: 'Auto-rescheduled conflicts', time: '+8m', when: 'Yesterday', icon: '🔄' },
    { id: 4, action: 'Optimized commute route', time: '+7m', when: 'Yesterday', icon: '🚗' },
  ];

  const milestones = [
    { id: 1, title: '1 Hour', reached: true, reward: '🎉' },
    { id: 2, title: '5 Hours', reached: true, reward: '⭐' },
    { id: 3, title: '10 Hours', reached: true, reward: '🏆' },
    { id: 4, title: '24 Hours', reached: false, reward: '👑', progress: 51 },
  ];

  const currentStats = stats[selectedPeriod];

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-32">
      <IOSStatusBar />

      <style>{`
        .ios-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 20px;
        }
        .time-glow {
          text-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
        }
      `}</style>
      
      {/* Header */}
      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('hub')}
            className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-[20px] font-bold text-slate-900">Time Wallet</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Hero Time Saved Card */}
      <div className="px-4 mb-5">
        <div 
          className="relative overflow-hidden rounded-[28px] p-6"
          style={{
            background: 'linear-gradient(145deg, #059669 0%, #10b981 50%, #34d399 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 blur-3xl" />
          
          <div className="relative">
            {/* Period Selector */}
            <div className="flex bg-white/20 rounded-full p-1 mb-6 w-fit">
              {(['today', 'week', 'month'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all ${
                    selectedPeriod === period
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-white/90'
                  }`}
                >
                  {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
                </button>
              ))}
            </div>

            {/* Main Time Display */}
            <div className="mb-4">
              <p className="text-white/80 text-[14px] font-medium mb-1">You've saved</p>
              <p className="text-[56px] font-black text-white leading-none time-glow">
                {currentStats.saved}
              </p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-6">
              <div>
                <p className="text-white/70 text-[12px]">Tasks done</p>
                <p className="text-white text-[20px] font-bold">{currentStats.tasks}</p>
              </div>
              <div>
                <p className="text-white/70 text-[12px]">Day streak</p>
                <div className="flex items-center gap-1">
                  <span className="text-[20px]">🔥</span>
                  <p className="text-white text-[20px] font-bold">{currentStats.streak}</p>
                </div>
              </div>
            </div>

            {/* Motivational message */}
            <div className="mt-5 pt-4 border-t border-white/20">
              <p className="text-white/90 text-[14px]">
                <Sparkles className="w-4 h-4 inline mr-1.5 text-yellow-300" />
                That's like getting a free lunch break this week!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="px-4 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="ios-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Weekly Goal</p>
                <p className="text-[17px] font-bold text-slate-900">67%</p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-[67%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
            </div>
          </div>
          
          <div className="ios-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-[20px]">🏆</span>
              </div>
              <div>
                <p className="text-[12px] text-slate-500">Total Saved</p>
                <p className="text-[17px] font-bold text-slate-900">12h 20m</p>
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-2">+2h 40m this week</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="px-4 mb-5">
        <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">Milestones</h2>
        <div className="ios-card p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id}
                className={`flex-shrink-0 w-20 text-center ${!milestone.reached ? 'opacity-60' : ''}`}
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-2 ${
                  milestone.reached 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' 
                    : 'bg-slate-100 relative overflow-hidden'
                }`}>
                  {milestone.reached ? (
                    milestone.reward
                  ) : (
                    <>
                      <span className="text-slate-400 text-xl">🔒</span>
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-purple-500/30"
                        style={{ height: `${milestone.progress}%` }}
                      />
                    </>
                  )}
                </div>
                <p className="text-[11px] font-medium text-slate-700">{milestone.title}</p>
                {!milestone.reached && milestone.progress && (
                  <p className="text-[10px] text-purple-600 font-semibold">{milestone.progress}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Saves */}
      <div className="px-4">
        <h2 className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide mb-3 px-1">How You Saved Time</h2>
        <div className="ios-card divide-y divide-slate-100">
          {recentSaves.map((save) => (
            <div key={save.id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                {save.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-slate-800 font-medium truncate">{save.action}</p>
                <p className="text-[12px] text-slate-500">{save.when}</p>
              </div>
              <div className="text-right">
                <p className="text-[16px] font-bold text-emerald-600">{save.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redeem Section */}
      <div className="px-4 mt-5">
        <div className="ios-card p-4 border-2 border-dashed border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-semibold text-slate-800">Unlock rewards</p>
              <p className="text-[13px] text-slate-500">Save 24 hours to unlock premium features</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}