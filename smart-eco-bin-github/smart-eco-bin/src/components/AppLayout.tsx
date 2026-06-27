/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home, QrCode, Map, Gift } from 'lucide-react';
import HomeView from './HomeView';
import ScannerView from './ScannerView';
import MapView from './MapView';
import RewardsView from './RewardsView';
import SupabaseView from './SupabaseView';
import DashboardView from './DashboardView';
import { Bin, Deposit, Reward, UserStats, BinType } from '../types';

interface AppLayoutProps {
  stats: UserStats;
  bins: Bin[];
  deposits: Deposit[];
  rewards: Reward[];
  onSimulateDeposit: (category: BinType, weight: number, points: number, itemName: string) => void;
  onRedeemReward: (rewardId: string, cost: number) => void;
  onResetDemo: () => void;
}

// Composant Placeholder qui affiche de manière dynamique l'écran actif
function Placeholder({ 
  view,
  stats,
  bins,
  deposits,
  rewards,
  onSimulateDeposit,
  onRedeemReward,
  onResetDemo
}: { 
  view: string;
  stats: UserStats;
  bins: Bin[];
  deposits: Deposit[];
  rewards: Reward[];
  onSimulateDeposit: (category: BinType, weight: number, points: number, itemName: string) => void;
  onRedeemReward: (rewardId: string, cost: number) => void;
  onResetDemo: () => void;
}) {
  switch (view) {
    case 'home':
      return (
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-none p-6">
          <DashboardView 
            stats={stats} 
            deposits={deposits} 
          />
          {/* Quick links to actions */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
              Raccourcis & Similitudes
            </h4>
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/40 text-center">
              <p className="text-[11px] text-gray-500 leading-normal">
                Prêt à apporter de nouvelles matières ? Allez sur l’onglet <strong className="text-emerald-700">Scanner</strong> pour simuler une pesée IA ou géolocalisez les bornes via l’onglet <strong className="text-emerald-700">Bornes</strong>.
              </p>
            </div>
          </div>
        </div>
      );
    case 'scan':
      return (
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
          <ScannerView 
            onScanDeposit={onSimulateDeposit}
            userPoints={stats.points}
          />
        </div>
      );
    case 'map':
      return (
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
          <MapView 
            bins={bins}
            onSimulateDeposit={onSimulateDeposit}
          />
        </div>
      );
    case 'rewards':
      return (
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
          <RewardsView 
            stats={stats} 
            rewards={rewards} 
            onRedeemReward={onRedeemReward}
          />
        </div>
      );
    case 'supabase':
      return (
        <div className="flex-1 overflow-y-auto pb-20 scrollbar-none">
          <SupabaseView 
            onResetDemo={onResetDemo}
          />
        </div>
      );
    default:
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-500 text-center">
          <p className="text-sm font-semibold">Vue indéterminée</p>
          <p className="text-xs text-gray-400 mt-1">L'onglet {view} n'est pas encore implémenté.</p>
        </div>
      );
  }
}

export default function AppLayout({
  stats,
  bins,
  deposits,
  rewards,
  onSimulateDeposit,
  onRedeemReward,
  onResetDemo
}: AppLayoutProps) {
  // L'état activeTab demandé pour basculer entre les différentes vues mobiles
  const [activeTab, setActiveTab] = useState<string>('home');

  // Définition des 4 icônes demandées : Home, QrCode, Map, Gift
  const navItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'scan', label: 'Scanner', icon: QrCode },
    { id: 'map', label: 'Bornes', icon: Map },
    { id: 'rewards', label: 'Cadeaux', icon: Gift },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-6 px-4">
      {/* Conteneur représentant l'écran d'un téléphone mobile (max-w-md, h-screen, overflow-hidden) */}
      <div className="relative w-full max-w-md h-[812px] bg-white rounded-[40px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col overflow-hidden">
        
        {/* Status bar simulée pour plus de réalisme mobile */}
        <div className="h-8 bg-white flex items-center justify-between px-6 pt-1 shrink-0 z-10">
          <span className="text-xs font-bold text-gray-900">09:41</span>
          <div className="flex items-center gap-1 text-gray-900 text-xs font-bold">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-gray-900 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-4 bg-gray-900 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* En-tête de l'application avec logo (clic redirige vers l'accueil) */}
        <div className="bg-white px-6 py-2.5 border-b border-gray-100 flex items-center justify-between shrink-0 z-10">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 hover:opacity-95 active:scale-98 transition-all text-left group"
            id="header-logo-button"
            title="Retour à l'accueil"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-emerald-100 shadow-xs flex items-center justify-center bg-white group-hover:border-emerald-300 transition-colors">
              <img 
                src="https://i.ibb.co/Jj1kYfGC/smart-eco-bin.jpg" 
                alt="Smart Eco Bin Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-gray-900 block group-hover:text-emerald-700 transition-colors">Smart Eco Bin</span>
              <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider block -mt-0.5">Tri Intelligent</span>
            </div>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
              {stats.points} pts
            </span>
          </div>
        </div>

        {/* Zone centrale affichant le composant fictif / interactif Placeholder */}
        <Placeholder 
          view={activeTab}
          stats={stats}
          bins={bins}
          deposits={deposits}
          rewards={rewards}
          onSimulateDeposit={onSimulateDeposit}
          onRedeemReward={onRedeemReward}
          onResetDemo={onResetDemo}
        />

        {/* Raccourci discret vers l'utilitaire Supabase */}
        <button 
          onClick={() => setActiveTab(activeTab === 'supabase' ? 'home' : 'supabase')}
          className="absolute right-4 bottom-20 z-40 p-2.5 bg-gray-950 text-white rounded-full shadow-md hover:bg-emerald-600 transition-all scale-90"
          title="Schéma Supabase SQL"
        >
          <span className="text-[10px] font-bold tracking-tight font-mono">SQL</span>
        </button>

        {/* Barre de navigation inférieure fixe (Bottom Navigation) */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-2 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                id={`app-layout-nav-${item.id}`}
                className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                  isActive 
                    ? 'text-emerald-600 font-semibold scale-105' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={20} className={isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'} />
                <span className="text-[10px] mt-1 font-sans">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Encoche home indicator d'iOS pour la finition premium */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-950 rounded-full z-40 pointer-events-none opacity-90" />
      </div>

      {/* Guide informatif externe */}
      <p className="text-[11px] text-gray-400 mt-3 text-center">
        Conteneur mobile de démonstration responsive • Conçu en émeraude épuré
      </p>
    </div>
  );
}
