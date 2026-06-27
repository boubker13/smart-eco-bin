/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Leaf, 
  Flame, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  History,
  Info
} from 'lucide-react';
import { Bin, Deposit, UserStats, BinType } from '../types';
import { WASTE_PRESETS } from '../mockData';

interface HomeViewProps {
  stats: UserStats;
  bins: Bin[];
  deposits: Deposit[];
  onSimulateDeposit: (category: BinType, weight: number, points: number, itemName: string) => void;
  onResetDemo: () => void;
}

export default function HomeView({
  stats,
  bins,
  deposits,
  onSimulateDeposit,
  onResetDemo
}: HomeViewProps) {
  const [selectedExpressBin, setSelectedExpressBin] = useState<BinType | null>(null);
  const [expressWeight, setExpressWeight] = useState<number>(350); // grams
  const [showTooltip, setShowTooltip] = useState(false);

  const getBinColor = (type: BinType) => {
    switch (type) {
      case 'plastic': return 'text-yellow-600 bg-yellow-50 border-yellow-100';
      case 'glass': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'organic': return 'text-amber-800 bg-amber-50 border-amber-100';
      case 'paper': return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getBinNameFr = (type: BinType) => {
    switch (type) {
      case 'plastic': return 'Plastique & Métal';
      case 'glass': return 'Verre';
      case 'organic': return 'Compost Bio';
      case 'paper': return 'Papier & Carton';
    }
  };

  const handleExpressSubmit = () => {
    if (!selectedExpressBin) return;
    
    // Calculate points and CO2 saved based on express weight
    const multiplier = selectedExpressBin === 'glass' ? 0.1 : selectedExpressBin === 'plastic' ? 0.3 : selectedExpressBin === 'paper' ? 0.2 : 0.05;
    const pts = Math.max(10, Math.round((expressWeight / 100) * 5));
    const co2 = Number(((expressWeight / 1000) * multiplier * 4).toFixed(2));
    const name = `Dépôt express ${getBinNameFr(selectedExpressBin)}`;
    
    onSimulateDeposit(selectedExpressBin, expressWeight, pts, name);
    setSelectedExpressBin(null);
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      
      {/* Header Profile Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm overflow-hidden">
            <span className="text-emerald-700 font-bold text-lg">EC</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 text-sm">Lucas Martin</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                Niv. {stats.level}
              </span>
            </div>
            <p className="text-xs text-gray-500">Eco-Citoyen engagé</p>
          </div>
        </div>
        
        {/* Streak Counter */}
        <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
          <Flame size={14} className="fill-amber-500 stroke-amber-500" />
          <span className="text-xs font-bold font-mono">5 Jours</span>
        </div>
      </div>

      {/* Main Eco-Score Ring Card */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Score Éco-Responsable
            </h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-gray-900 font-sans tracking-tight">
                {stats.ecoScore}
              </span>
              <span className="text-sm font-medium text-gray-400">/100</span>
              <span className="text-xs text-emerald-600 font-bold ml-2 flex items-center gap-0.5">
                <TrendingUp size={12} /> +2%
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Info size={16} />
          </button>
        </div>

        {showTooltip && (
          <div className="mb-4 p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-500 leading-relaxed border border-gray-100">
            Votre Eco-Score augmente à chaque dépôt régulier et correct. Il diminue légèrement si vous stockez trop de déchets chez vous.
          </div>
        )}

        {/* Horizontal Experience Progress bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-500">Progression Niveau {stats.level}</span>
            <span className="font-bold text-gray-900 font-mono">{stats.levelProgress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.levelProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              CO₂ Évité (Total)
            </span>
            <span className="text-lg font-bold text-emerald-600 font-mono mt-0.5 block">
              {stats.totalCarbonSavedKg.toFixed(1)} kg
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Points Éco-Bin
            </span>
            <span className="text-lg font-bold text-amber-500 font-mono mt-0.5 block flex items-center gap-1">
              {stats.points} <span className="text-xs font-normal text-amber-600">★</span>
            </span>
          </div>
        </div>
      </div>

      {/* Smart Bins Fill Level */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Trash2 size={15} className="text-emerald-600" />
            Statut des Bornes de Quartier
          </h4>
          <span className="text-[11px] text-gray-400">Temps réel</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {bins.map((bin) => {
            const isFull = bin.fillLevel >= 80;
            const colorClass = getBinColor(bin.type);
            return (
              <div 
                key={bin.id}
                className={`p-3.5 rounded-2xl border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] relative flex flex-col justify-between h-[105px]`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${colorClass}`}>
                      {getBinNameFr(bin.type)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{bin.distance}</span>
                  </div>
                  <h5 className="text-[11px] font-semibold text-gray-900 mt-2 truncate">
                    {bin.name.split(' - ')[0]}
                  </h5>
                </div>

                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500">Remplissage</span>
                    <span className={`font-mono font-bold ${isFull ? 'text-rose-500' : 'text-gray-900'}`}>
                      {bin.fillLevel}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull 
                          ? 'bg-rose-500' 
                          : bin.fillLevel >= 60 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-600'
                      }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulation / Quick Action Panel */}
      <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/40">
        {!selectedExpressBin ? (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={14} className="text-emerald-600" />
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                Simuler un dépôt express
              </h4>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              Déposez rapidement des matières recyclables pour voir vos indicateurs s’envoler.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(['plastic', 'glass', 'organic', 'paper'] as BinType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedExpressBin(type)}
                  className="py-2.5 px-1 rounded-xl bg-white hover:bg-emerald-50 text-[10px] font-semibold text-gray-700 border border-gray-100 hover:border-emerald-200 transition-all text-center flex flex-col items-center justify-center gap-1 shadow-sm"
                >
                  <span className={`w-2 h-2 rounded-full ${
                    type === 'plastic' ? 'bg-yellow-500' : 
                    type === 'glass' ? 'bg-emerald-600' : 
                    type === 'organic' ? 'bg-amber-700' : 'bg-blue-500'
                  }`} />
                  {type === 'plastic' ? 'Plastique' : 
                   type === 'glass' ? 'Verre' : 
                   type === 'organic' ? 'Bio' : 'Papier'}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1">
                <Leaf size={12} />
                Dépôt {getBinNameFr(selectedExpressBin)}
              </span>
              <button 
                onClick={() => setSelectedExpressBin(null)}
                className="text-[10px] text-gray-400 hover:text-gray-600"
              >
                Annuler
              </button>
            </div>
            
            {/* Weight Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-gray-600">
                <span>Poids estimé</span>
                <span className="font-bold text-gray-950 font-mono">{expressWeight} g</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="2000" 
                step="50"
                value={expressWeight}
                onChange={(e) => setExpressWeight(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                <span>50g</span>
                <span>1kg</span>
                <span>2kg</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExpressSubmit}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Confirmer l'apport • +{Math.max(10, Math.round((expressWeight / 100) * 5))} pts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Deposits History Feed */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <History size={15} className="text-emerald-600" />
            Historique d’activité
          </h4>
          <span className="text-[11px] text-gray-400">Dépôts récents</span>
        </div>

        <div className="space-y-2">
          {deposits.slice(0, 3).map((deposit) => (
            <div 
              key={deposit.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  deposit.binType === 'plastic' ? 'bg-yellow-50 text-yellow-600' :
                  deposit.binType === 'glass' ? 'bg-emerald-50 text-emerald-600' :
                  deposit.binType === 'organic' ? 'bg-amber-50 text-amber-800' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <Leaf size={14} />
                </div>
                <div>
                  <h5 className="text-[11px] font-semibold text-gray-900">
                    {deposit.itemName}
                  </h5>
                  <p className="text-[9px] text-gray-400">
                    {new Date(deposit.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })} • {deposit.weightGrams}g
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-bold text-amber-500 block">
                  +{deposit.pointsEarned} pts
                </span>
                <span className="text-[9px] text-emerald-600 font-mono block">
                  -{deposit.co2SavedKg} kg CO₂
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Demo button */}
      <div className="pt-4 flex justify-center">
        <button
          onClick={onResetDemo}
          className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors underline"
        >
          Réinitialiser les données de démo
        </button>
      </div>

    </div>
  );
}
