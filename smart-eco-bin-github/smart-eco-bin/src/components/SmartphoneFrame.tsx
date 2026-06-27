/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Home, 
  QrCode, 
  MapPin, 
  Gift, 
  Database,
  Wifi, 
  Battery, 
  Signal 
} from 'lucide-react';

interface SmartphoneFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  points: number;
}

export default function SmartphoneFrame({ 
  children, 
  activeTab, 
  setActiveTab,
  points
}: SmartphoneFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hrs}:${mins}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'scan', label: 'Scan IA', icon: QrCode },
    { id: 'map', label: 'Bornes', icon: MapPin },
    { id: 'rewards', label: 'Cadeaux', icon: Gift },
    { id: 'supabase', label: 'Supabase', icon: Database },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10 px-4">
      {/* Outer Phone Wrapper */}
      <div className="relative w-full max-w-[410px] h-[840px] bg-white rounded-[50px] shadow-[0_24px_60px_rgba(0,0,0,0.1)] border-[10px] border-gray-900 flex flex-col overflow-hidden select-none">
        
        {/* Physical Button Accents */}
        <div className="absolute left-[-13px] top-[140px] w-[3px] h-[60px] bg-gray-800 rounded-r" />
        <div className="absolute left-[-13px] top-[210px] w-[3px] h-[50px] bg-gray-800 rounded-r" />
        <div className="absolute left-[-13px] top-[270px] w-[3px] h-[50px] bg-gray-800 rounded-r" />
        <div className="absolute right-[-13px] top-[180px] w-[3px] h-[80px] bg-gray-800 rounded-l" />

        {/* Status Bar */}
        <div className="h-12 bg-white flex items-center justify-between px-8 pt-2 z-40 relative shrink-0">
          {/* Clock */}
          <span className="text-xs font-semibold text-gray-900 font-sans">
            {time || '09:41'}
          </span>
          
          {/* Dynamic Notch / Island */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-3 w-28 h-6 bg-gray-950 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-gray-900 rounded-full absolute right-4" />
            <div className="w-1.5 h-1.5 bg-[#0a1128] rounded-full absolute right-5 opacity-40" />
          </div>

          {/* Indicators */}
          <div className="flex items-center gap-1.5 text-gray-900">
            <Signal size={12} className="stroke-[2.5]" />
            <span className="text-[10px] font-bold tracking-tight">5G</span>
            <Wifi size={12} className="stroke-[2.5]" />
            <div className="flex items-center gap-0.5 ml-0.5">
              <Battery size={15} className="stroke-[2]" />
              <span className="text-[9px] font-bold">85%</span>
            </div>
          </div>
        </div>

        {/* Scrollable Viewport Inner Content */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
          {children}
        </div>

        {/* Elegant Bottom Home Indicator Bar (iOS style) & Navigation */}
        <div className="bg-white border-t border-gray-100 px-3 pt-2 pb-5 shrink-0 z-40">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  id={`nav-tab-${item.id}`}
                  className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 relative ${
                    isActive 
                      ? 'text-emerald-600 font-medium' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`transition-transform duration-300 ${
                      isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                    }`} 
                  />
                  <span className="text-[10px] mt-1 font-sans tracking-tight">
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <span className="absolute bottom-0 w-1 h-1 bg-emerald-600 rounded-full" />
                  )}
                  
                  {/* Subtle Points Badge for rewards tab if we have points */}
                  {item.id === 'rewards' && points > 0 && (
                    <span className="absolute top-1 right-2 bg-amber-500 text-white font-bold text-[8px] h-3.5 px-1 rounded-full flex items-center justify-center min-w-[14px]">
                      {points}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Physical Bottom Swipe Bar */}
          <div className="w-32 h-1 bg-gray-900 rounded-full mx-auto mt-3.5 opacity-90" />
        </div>
      </div>
      
      {/* Footer Info Outside Device for web instructions */}
      <p className="text-xs text-gray-400 mt-4 text-center max-w-[340px]">
        Smart Eco Bin • Présentation interactive mobile
        <br />
        Double-cliquez pour simuler ou naviguez via la barre inférieure.
      </p>
    </div>
  );
}
