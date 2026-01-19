import { Phone, Settings, Mic } from "lucide-react";
import { useState } from "react";
import { Motion } from "motion/react";
import { MYPAOrb } from "../components/MYPAOrb";

interface ListeningScreenProps {
  onEndCall: () => void;
  onSettings?: () => void;
}

export function ListeningScreen({ onEndCall, onSettings }: ListeningScreenProps) {
  // Mock transcript data
  const transcripts = [
    { id: 1, text: "Hey MyPA! Write me a script for building an Analog Clock.", isUser: true },
    { id: 2, text: "Sure thing! Do you want that in React or vanilla JS?", isUser: false },
    { id: 3, text: "React please, using Tailwind.", isUser: true },
  ];

  return (
    <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-between items-start pt-8">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            I'M<br />LISTENING...
          </h1>
        </div>
        <button 
          onClick={onSettings}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Settings className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Visual - MYPA Orb */}
      <div className="relative flex items-center justify-center w-full max-w-[300px] aspect-square my-8">
        <MYPAOrb size="xl" showGlow={true} />
      </div>

      {/* Transcripts */}
      <div className="w-full space-y-4 mb-8">
        {transcripts.map((t, i) => (
          <div 
            key={t.id}
            className={`w-full p-4 rounded-2xl backdrop-blur-md border border-white/10
              ${t.isUser 
                ? 'bg-gradient-to-r from-[#B58CFF]/20 to-[#64C7FF]/20 text-white ml-auto max-w-[90%]' 
                : 'bg-white/10 text-white/80 mr-auto max-w-[90%]'
              }`}
            style={{
               opacity: 0.8 - (transcripts.length - 1 - i) * 0.2 // Fade older messages
            }}
          >
            <p className="text-[15px] font-medium leading-relaxed">
              {t.text}
            </p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 mb-8">
        <button 
          onClick={onEndCall}
          className="w-16 h-16 rounded-full bg-[#FF453A] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Phone className="w-8 h-8 text-white rotate-[135deg]" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
