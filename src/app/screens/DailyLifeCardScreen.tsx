import { ArrowLeft, Camera, Flame } from "lucide-react";
import { IOSStatusBar } from "../components/IOSStatusBar";
import { useState } from "react";

interface DailyLifeCardScreenProps {
  onNavigate?: (screen: string) => void;
}

export function DailyLifeCardScreen({ onNavigate }: DailyLifeCardScreenProps) {
  const [missions, setMissions] = useState(4);
  const [wallet, setWallet] = useState('+42m');
  const [streak, setStreak] = useState(6);
  const [tomorrow, setTomorrow] = useState([
    'Morning workout',
    'Focus work session',
    'Team standup',
  ]);

  return (
    <div className="min-h-screen bg-[#F6F7FA] pb-32">
      <IOSStatusBar />
      
      {/* Header */}
      <div className="px-6 pt-4 pb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('hub')}
            className="p-2 rounded-full hover:bg-black/5 transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="text-[20px] font-semibold text-slate-800">Daily Life Card</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="px-6 space-y-6">
        <p className="text-[15px] text-slate-600">Share your progress with your circle</p>

        {/* Proof Thumbnail (optional) */}
        <div>
          <h2 className="text-[17px] font-semibold text-slate-800 mb-3">Proof (optional)</h2>
          <button className="w-full aspect-video rounded-[20px] bg-white border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:border-purple-400 transition-colors">
            <Camera className="w-8 h-8 text-slate-400 mb-2" />
            <span className="text-[15px] text-slate-500">Add photo</span>
          </button>
        </div>

        {/* Today's Stats */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
          <h2 className="text-[17px] font-semibold text-slate-800 mb-4">Today's Progress</h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-[13px] text-slate-500 mb-2">Missions</p>
              <p className="text-[28px] font-semibold text-slate-800">{missions}/5</p>
            </div>
            <div>
              <p className="text-[13px] text-slate-500 mb-2">Wallet</p>
              <p className="text-[28px] font-semibold text-green-600">{wallet}</p>
            </div>
            <div>
              <p className="text-[13px] text-slate-500 mb-2">Streak</p>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <p className="text-[28px] font-semibold text-orange-600">{streak}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tomorrow's Top 3 */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
          <h2 className="text-[17px] font-semibold text-slate-800 mb-4">Tomorrow's Top 3</h2>
          
          <div className="space-y-3">
            {tomorrow.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-[13px] font-semibold text-purple-600">{index + 1}</span>
                </div>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newTomorrow = [...tomorrow];
                    newTomorrow[index] = e.target.value;
                    setTomorrow(newTomorrow);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-[15px] text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-purple-50 rounded-[20px] p-4 border border-purple-200">
          <p className="text-[13px] text-slate-700">
            <span className="font-medium">Privacy:</span> Metrics only (no personal details shared)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full py-4 rounded-full bg-gradient-to-r from-[#B58CFF] to-[#64C7FF] text-white text-[17px] font-medium hover:opacity-90 transition-opacity shadow-lg">
            Share to Circle
          </button>
          <button className="w-full py-4 rounded-full bg-white text-slate-800 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200">
            Share Metrics Only
          </button>
          <button className="w-full py-4 rounded-full bg-white text-slate-600 text-[17px] font-medium hover:bg-slate-50 transition-colors border border-slate-200">
            Save Private
          </button>
        </div>
      </div>
    </div>
  );
}
