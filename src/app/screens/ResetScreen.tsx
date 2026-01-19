import { ArrowLeft, Heart } from "lucide-react";
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

  const reasons = [
    { id: 'stress', label: 'Feeling stressed' },
    { id: 'tired', label: 'Too tired' },
    { id: 'busy', label: 'Too busy' },
    { id: 'forgot', label: 'Just forgot' },
  ];

  const smallWins = [
    { id: 'walk', label: '10-minute walk', time: '10 min' },
    { id: 'read', label: 'Read 5 pages', time: '15 min' },
    { id: 'organize', label: 'Organize desk', time: '10 min' },
  ];

  if (wizardStep === 'intro') {
    return (
      <div className="min-h-screen bg-[#F6F7FA] pb-32 flex flex-col">
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
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          
          <h1 className="text-[28px] font-semibold text-slate-800 mb-4 text-center">
            Let's reset and re-plan
          </h1>
          
          <p className="text-[17px] text-slate-600 text-center mb-8 max-w-sm">
            Sometimes things don't go as planned. That's okay. Let's get you back on track with a fresh start.
          </p>

          <div className="w-full max-w-sm space-y-3">
            <button 
              onClick={() => setWizardStep('reason')}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[17px] font-medium hover:opacity-90 transition-opacity shadow-lg"
            >
              Rebuild today
            </button>
            <button
              onClick={() => onNavigate?.('plan')}
              className="w-full py-4 rounded-full bg-white text-slate-800 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Plan tomorrow
            </button>
            <button
              onClick={() => onVoiceClick?.()}
              className="w-full py-4 rounded-full bg-white text-slate-800 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200"
            >
              Talk to MYPA
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (wizardStep === 'reason') {
    return (
      <div className="min-h-screen bg-[#F6F7FA] pb-32">
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
            <span className="text-[13px] text-slate-500">Step 1 of 3</span>
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
                className={`w-full py-4 px-6 rounded-[20px] text-[17px] font-medium transition-all text-left ${
                  selectedReason === reason.id
                    ? 'bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200 hover:border-purple-300'
                }`}
              >
                {reason.label}
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
      <div className="min-h-screen bg-[#F6F7FA] pb-32">
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
            <span className="text-[13px] text-slate-500">Step 2 of 3</span>
          </div>
        </div>

        <div className="px-6">
          <h2 className="text-[24px] font-semibold text-slate-800 mb-3">
            Pick one small win
          </h2>
          <p className="text-[15px] text-slate-600 mb-8">
            Start simple. Build momentum.
          </p>

          <div className="space-y-3 mb-8">
            {smallWins.map(win => (
              <button
                key={win.id}
                onClick={() => setSelectedWin(win.id)}
                className={`w-full py-5 px-6 rounded-[20px] transition-all text-left ${
                  selectedWin === win.id
                    ? 'bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white shadow-md'
                    : 'bg-white border border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[17px] font-medium">{win.label}</span>
                  <span className={`text-[13px] ${selectedWin === win.id ? 'text-white/80' : 'text-slate-500'}`}>
                    {win.time}
                  </span>
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
      <div className="min-h-screen bg-[#F6F7FA] pb-32">
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
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[17px] font-medium hover:opacity-90 transition-opacity shadow-lg"
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