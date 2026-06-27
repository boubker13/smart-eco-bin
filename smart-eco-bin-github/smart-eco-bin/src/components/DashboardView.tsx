/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Leaf, Flame, Shield, ArrowUpRight, Scale } from 'lucide-react';
import { UserStats, Deposit } from '../types';

interface DashboardViewProps {
  stats: UserStats;
  deposits: Deposit[];
}

export default function DashboardView({ stats, deposits }: DashboardViewProps) {
  // Take top 3 deposits for the "Derniers recyclages" section
  const recentDeposits = deposits.slice(0, 3);

  // Helper to get formatted date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to translate and style bin types
  const getCategoryDetails = (type: string) => {
    switch (type) {
      case 'plastic':
        return { label: 'Plastique', bg: 'bg-yellow-50 text-yellow-700' };
      case 'glass':
        return { label: 'Verre', bg: 'bg-emerald-50 text-emerald-700' };
      case 'organic':
        return { label: 'Organique', bg: 'bg-amber-50 text-amber-900' };
      case 'paper':
        return { label: 'Papier & Carton', bg: 'bg-blue-50 text-blue-700' };
      default:
        return { label: type, bg: 'bg-gray-50 text-gray-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* En haut : Message de bienvenue et photo de profil fictive */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">Bienvenue</p>
          <h1 className="text-xl font-bold text-gray-900 font-display">
            Bonjour, Lucas !
          </h1>
        </div>
        
        {/* Photo de profil fictive */}
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" 
              alt="Lucas Martin"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
      </div>

      {/* En dessous : Carte premium "Solde Écologique" */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-3xl p-6 text-white overflow-hidden shadow-md">
        {/* Ornement de fond subtil émeraude */}
        <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
              Compte Vert SmartBin
            </span>
            <h3 className="text-sm text-gray-300 font-medium">
              Solde Écologique
            </h3>
          </div>
          
          {/* Icône dorée (yellow-500) */}
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shadow-inner">
            <Award size={20} className="fill-yellow-500/20 animate-pulse" />
          </div>
        </div>

        {/* Gros chiffre de points */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight font-sans text-white">
            {stats.points.toLocaleString('fr-FR')}
          </span>
          <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">
            Points Éco
          </span>
        </div>

        {/* Badge d'impact carbone évité */}
        <div className="mt-5 flex items-center gap-3 pt-4 border-t border-gray-800 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <Leaf size={13} />
            <span>-{stats.totalCarbonSavedKg.toFixed(1)} kg CO₂</span>
          </div>
          <div className="w-1 h-1 bg-gray-700 rounded-full" />
          <div className="flex items-center gap-1.5 text-gray-300">
            <Scale size={13} />
            <span>Niveau {stats.level}</span>
          </div>
        </div>
      </div>

      {/* Section "Derniers recyclages" - Liste élégante de 3 éléments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Derniers recyclages
          </h4>
          <span className="text-[10px] text-gray-400 font-medium">3 derniers apports</span>
        </div>

        <div className="space-y-2">
          {recentDeposits.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs bg-white border border-gray-50 rounded-2xl">
              Aucun recyclage enregistré pour l'instant.
            </div>
          ) : (
            recentDeposits.map((item) => {
              const catInfo = getCategoryDetails(item.binType);
              const weightKg = (item.weightGrams / 1000).toFixed(2);
              return (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    {/* Badge de catégorie avec couleurs distinctes */}
                    <div className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${catInfo.bg}`}>
                      {catInfo.label}
                    </div>
                    
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-gray-900 truncate max-w-[120px]">
                        {item.itemName}
                      </h5>
                      <p className="text-[9px] text-gray-400">
                        {formatDate(item.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Poids */}
                    <span className="text-[11px] font-semibold text-gray-600 font-mono">
                      {weightKg} kg
                    </span>
                    
                    {/* Points gagnés */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 justify-end">
                        +{item.pointsEarned} pts
                        <ArrowUpRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
