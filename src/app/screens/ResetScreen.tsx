import { ArrowLeft, Heart, Sparkles, RefreshCw, MessageCircle, Target, Flame } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState } from "react";

interface ResetScreenProps {
  onNavigate?: (screen: string) => void;
  onVoiceClick?: () => void;
}

export function ResetScreen({ onNavigate, onVoiceClick }: ResetScreenProps) {
  const [wizardStep, setWizardStep] = useState<'intro' | 'reason' | 'pickWin' | 'autoFix'>('intro');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [selectedWin, setSelectedWin] = useState<string | null>(null);

  // Stats for encouraging the user
  const encouragingStats = {
    previousResets: 3,
    successRate: 85,
    currentStreak: 7,
    comebackStreak: 12,
  };

  const reasons = [
    { id: 'stress', label: 'Feeling stressed', emoji: '😰', tip: "That's normal. Let's simplify today." },
    { id: 'tired', label: 'Too tired', emoji: '😴', tip: "Rest is productive. Let's focus on essentials." },
    { id: 'busy', label: 'Too busy', emoji: '🏃', tip: "Let's trim the non-essentials." },
    { id: 'forgot', label: 'Just forgot', emoji: '🤷', tip: "No worries! Lets get back on track." },
  ];

  const smallWins = [
    { id: 'walk', label: '10-minute walk', time: '10 min', emoji: '🚶', xp: 15 },
    { id: 'read', label: 'Read 5 pages', time: '15 min', emoji: '📖', xp: 20 },
    { id: 'organize', label: 'Organize desk', time: '10 min', emoji: '🗂️', xp: 15 },
    { id: 'breathe', label: '5-min breathing', time: '5 min', emoji: '🧘', xp: 10 },
    { id: 'water', label: 'Drink 3 glasses water', time: '—', emoji: '💧', xp: 10 },
  ];

  if (wizardStep === 'intro') {
    return (
      <div className="min-h-screen bg-ios-bg pb-32 flex flex-col">
        <IOSStatusBar />
        
        {/* Header */}
        <div className="px-6 pt-4 pb-6">
          <button 
            onClick={() => window.history.back()}
            className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Hero Card */}
          <div className="w-full max-w-sm rounded-[24px] p-6 mb-6 shadow-xl" style={{ background: 'linear-gradient(145deg, var(--dark-card-start) 0%, var(--dark-card-middle) 50%, var(--dark-card-end) 100%)' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <h1 className="text-[24px] font-bold text-white mb-2 text-center">
              Let's reset together
            </h1>
            <p className="text-[14px] text-white/60 text-center mb-4">
              Everyone needs a fresh start sometimes. You've bounced back {encouragingStats.previousResets} times before with {encouragingStats.successRate}% success.
            </p>
            
            {/* Encouraging Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-white text-[16px] font-bold">{encouragingStats.currentStreak}</p>
                <p className="text-white/50 text-[10px]">Current streak</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-white text-[16px] font-bold">{encouragingStats.comebackStreak}</p>
                <p className="text-white/50 text-[10px]">Best comeback</p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <button 
              onClick={() => setWizardStep('reason')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[17px] font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Rebuild today
            </button>
            <button
              onClick={() => onNavigate?.('plan')}
              className="w-full py-4 rounded-full bg-white text-slate-800 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Plan tomorrow instead
            </button>
            <button
              onClick={() => onVoiceClick?.()}
              className="w-full py-4 rounded-full bg-white text-slate-800 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-purple-600" />
              Talk to MYPA
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (wizardStep === 'reason') {
    return (
      <div className="min-h-screen bg-ios-bg pb-32">
        <IOSStatusBar />
        
        {/* Header */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setWizardStep('intro')}
              className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <span className="text-[13px] text-slate-500 font-medium">Step 1 of 3</span>
          </div>
        </div>

        <div className="px-6">
          <h2 className="text-[24px] font-semibold text-slate-800 mb-3">
            What happened?
          </h2>
          <p className="text-[15px] text-slate-600 mb-8">
            This helps MYPA understand your patterns and adapt better.
          </p>

          <div className="space-y-3 mb-8">
            {reasons.map(reason => (
              <button
                key={reason.id}
                onClick={() => setSelectedReason(reason.id)}
                className={`w-full py-4 px-5 rounded-[20px] text-left transition-all ${
                  selectedReason === reason.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'bg-white text-slate-800 border border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reason.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[17px] font-medium">{reason.label}</p>
                    {selectedReason === reason.id && (
                      <p className="text-[13px] text-white/80 mt-1">{reason.tip}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setWizardStep('pickWin')}
            disabled={!selectedReason}
            className="w-full py-4 rounded-full bg-slate-800 text-white text-[17px] font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (wizardStep === 'pickWin') {
    return (
      <div className="min-h-screen bg-ios-bg pb-32">
        <IOSStatusBar />
        
        {/* Header */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setWizardStep('reason')}
              className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <span className="text-[13px] text-slate-500 font-medium">Step 2 of 3</span>
          </div>
        </div>

        <div className="px-6">
          <h2 className="text-[24px] font-semibold text-slate-800 mb-3">
            Pick one small win
          </h2>
          <p className="text-[15px] text-slate-600 mb-8">
            Start simple. Build momentum. Earn XP.
          </p>

          <div className="space-y-3 mb-8">
            {smallWins.map(win => (
              <button
                key={win.id}
                onClick={() => setSelectedWin(win.id)}
                className={`w-full py-5 px-5 rounded-[20px] transition-all text-left ${
                  selectedWin === win.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'bg-white border border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{win.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[17px] font-medium">{win.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[13px] ${selectedWin === win.id ? 'text-white/80' : 'text-slate-500'}`}>
                        {win.time}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        selectedWin === win.id ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
                      }`}>
                        +{win.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setWizardStep('autoFix')}
            disabled={!selectedWin}
            className="w-full py-4 rounded-full bg-slate-800 text-white text-[17px] font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (wizardStep === 'autoFix') {
    return (
      <div className="min-h-screen bg-ios-bg pb-32">
        <IOSStatusBar />
        
        {/* Header */}
        <div className="px-6 pt-4 pb-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setWizardStep('pickWin')}
              className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
            >
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <span className="text-[13px] text-slate-500">Step 3 of 3</span>
          </div>
        </div>

        <div className="px-6">
          <h2 className="text-[24px] font-semibold text-slate-800 mb-3">
            Tomorrow's plan
          </h2>
          <p className="text-[15px] text-slate-600 mb-8">
            I've adjusted your schedule to make tomorrow easier.
          </p>

          {/* Schedule Preview */}
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200 mb-8">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-[15px] font-medium text-slate-600 w-20">7:00 AM</span>
                <div className="flex-1">
                  <p className="text-[17px] font-medium text-slate-800">Morning routine</p>
                  <p className="text-[13px] text-slate-500">Simplified version</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[15px] font-medium text-slate-600 w-20">9:00 AM</span>
                <div className="flex-1">
                  <p className="text-[17px] font-medium text-slate-800">Focus work</p>
                  <p className="text-[13px] text-slate-500">Moved from afternoon</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-[15px] font-medium text-slate-600 w-20">12:00 PM</span>
                <div className="flex-1">
                  <p className="text-[17px] font-medium text-slate-800">Lunch break</p>
                  <p className="text-[13px] text-slate-500">Extended +15 min</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setWizardStep('intro');
                onNavigate?.('hub');
              }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-[17px] font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Accept plan
            </button>
            <button
              onClick={() => onNavigate?.('plan')}
              className="w-full py-4 rounded-full bg-white text-slate-800 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Let me adjust it
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}