/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Info,
  QrCode,
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Award,
  Loader2
} from 'lucide-react';
import { WASTE_PRESETS, WastePreset } from '../mockData';
import { BinType } from '../types';

interface ScannerViewProps {
  onScanDeposit: (category: BinType, weight: number, points: number, itemName: string) => void;
  userPoints: number;
}

export default function ScannerView({ onScanDeposit, userPoints }: ScannerViewProps) {
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'connected' | 'success'>('idle');
  const [scanningProgress, setScanningProgress] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<WastePreset>(WASTE_PRESETS[0]);
  const [recentDeposit, setRecentDeposit] = useState<WastePreset | null>(null);

  // Simulates scanning transition
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanStatus === 'scanning') {
      setScanningProgress(0);
      interval = setInterval(() => {
        setScanningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanStatus('connected');
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanStatus]);

  const handleStartScan = () => {
    setRecentDeposit(null);
    setScanStatus('scanning');
  };

  const handleSelectPreset = (preset: WastePreset) => {
    setSelectedPreset(preset);
  };

  const handleConfirmDeposit = () => {
    if (!selectedPreset) return;
    onScanDeposit(
      selectedPreset.category, 
      selectedPreset.weightGrams, 
      selectedPreset.points, 
      selectedPreset.name
    );
    setRecentDeposit(selectedPreset);
    setScanStatus('success');
  };

  const getBinNameFr = (type: BinType) => {
    switch (type) {
      case 'plastic': return 'Plastique & Métal (Jaune)';
      case 'glass': return 'Verre (Vert)';
      case 'organic': return 'Bio-Compost (Marron)';
      case 'paper': return 'Papier & Carton (Bleu)';
    }
  };

  const getCategoryColorText = (type: BinType) => {
    switch (type) {
      case 'plastic': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'glass': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'organic': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'paper': return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="flex-1 p-6 space-y-5 flex flex-col h-full bg-slate-50/35 overflow-y-auto scrollbar-none" id="scanner-view-container">
      {/* CSS custom keyframe definitions for scanning effect */}
      <style>{`
        @keyframes laser-sweep {
          0% { top: 0%; opacity: 0.3; }
          50% { top: 99%; opacity: 1; }
          100% { top: 0%; opacity: 0.3; }
        }
        .animate-laser-sweep {
          animation: laser-sweep 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header text */}
      <div className="text-center space-y-1" id="scanner-header">
        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider flex items-center justify-center gap-1">
          <QrCode size={12} />
          Connexion SmartBin
        </span>
        <h3 className="text-sm font-bold text-gray-500" id="scanner-header-text">
          Scannez le QR Code de la Smart Eco Bin
        </h3>
      </div>

      {/* Camera Simulator viewport */}
      <div 
        id="scanner-viewport"
        className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-900 shadow-xl flex flex-col justify-center items-center select-none"
      >
        {/* Soft simulated camera grid/crosshair */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-5 pointer-events-none">
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-r border-b border-white" />
          <div className="border-b border-white" />
          <div className="border-r border-white" />
          <div className="border-r border-white" />
          <div className="border-white" />
        </div>

        {/* Floating live badge */}
        <div className="absolute top-3 left-3 bg-red-600/90 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 z-30 shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          REC LIVE
        </div>

        {/* Viewfinder corner targets */}
        <div className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-sm pointer-events-none z-20 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-sm pointer-events-none z-20 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-sm pointer-events-none z-20 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-sm pointer-events-none z-20 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />

        {/* Bouncing laser line sweeping top-to-bottom */}
        {(scanStatus === 'idle' || scanStatus === 'scanning') && (
          <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] z-20 animate-laser-sweep pointer-events-none" />
        )}

        {/* Screen layout switches */}
        {scanStatus === 'idle' && (
          <div className="text-center p-6 space-y-3 z-10 animate-fade-in">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-emerald-400">
              <QrCode size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-100 font-mono tracking-wide">
                PRÊT À LIRE LE CODE
              </p>
              <p className="text-[10px] text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                Positionnez votre mobile face au code affiché sur l'écran tactile du collecteur.
              </p>
            </div>
          </div>
        )}

        {scanStatus === 'scanning' && (
          <div className="text-center p-6 space-y-3 z-10 animate-fade-in">
            <Loader2 size={32} className="text-emerald-400 animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-white font-mono tracking-widest uppercase">
                Analyse du QR Code...
              </p>
              <p className="text-[11px] text-emerald-400 font-mono">
                {scanningProgress}%
              </p>
            </div>
          </div>
        )}

        {scanStatus === 'connected' && (
          <div className="text-center p-6 space-y-2 z-10 animate-fade-in">
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-emerald-400 font-mono">
                BORNE CONNECTÉE !
              </p>
              <p className="text-[10px] text-gray-300 max-w-[180px] mx-auto">
                Choisissez le déchet à déposer ci-dessous pour finaliser l'apport.
              </p>
            </div>
          </div>
        )}

        {scanStatus === 'success' && recentDeposit && (
          <div className="text-center p-5 space-y-3 z-10 animate-fade-in">
            <div className="w-11 h-11 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-500 shadow-lg animate-bounce">
              <Award size={22} className="fill-yellow-500/10" />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-yellow-500 font-mono tracking-wider">
                TRI CRÉDITÉ !
              </p>
              <p className="text-xs text-white font-bold leading-tight">
                +{recentDeposit.points} Points ajoutés
              </p>
              <p className="text-[9px] text-gray-400">
                Poids mesuré : {recentDeposit.weightGrams}g
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Controls according to state */}
      <div className="flex-1 flex flex-col justify-end">
        {scanStatus === 'idle' && (
          <button
            id="btn-simulate-detect"
            onClick={handleStartScan}
            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 active:scale-[0.98] transition-all text-white font-bold rounded-2xl shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 text-xs flex items-center justify-center gap-2"
          >
            <QrCode size={16} />
            Simuler la détection
          </button>
        )}

        {scanStatus === 'scanning' && (
          <div className="w-full text-center py-4 text-[11px] text-gray-400 italic">
            Patientez pendant la synchronisation avec le collecteur...
          </div>
        )}

        {scanStatus === 'connected' && (
          <div className="space-y-4 animate-fade-in w-full">
            {/* Waste Preset Picker */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                Sélectionnez le déchet à recycler :
              </span>
              <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                {WASTE_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between h-[64px] ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/10' 
                          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-800'
                      }`}
                    >
                      <span className="text-[10px] font-bold truncate block w-full">{preset.name}</span>
                      <div className="flex items-center justify-between w-full mt-1">
                        <span className="text-[9px] text-gray-400 font-mono">{preset.weightGrams}g</span>
                        <span className="text-[10px] font-extrabold text-amber-500 font-mono">+{preset.points} pts</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Consigne block */}
            <div className={`p-3 rounded-xl border text-[10px] leading-relaxed flex items-start gap-2 ${getCategoryColorText(selectedPreset.category)}`}>
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">
                  Consigne : Déposez dans le bac {getBinNameFr(selectedPreset.category)}
                </p>
                <p className="text-gray-500 font-medium italic">
                  &ldquo;{selectedPreset.tip}&rdquo;
                </p>
              </div>
            </div>

            <button
              id="btn-confirm-deposit"
              onClick={handleConfirmDeposit}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              Déposer et récolter les points
              <ArrowUpRight size={14} className="text-emerald-400" />
            </button>
          </div>
        )}

        {scanStatus === 'success' && recentDeposit && (
          <div className="space-y-4 animate-fade-in w-full text-center">
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 text-left space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Rapport d'éco-impact</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Lucas, votre dépôt de <strong className="text-gray-800">{recentDeposit.name}</strong> a permis d'éviter l'émission de <strong className="text-emerald-700">{recentDeposit.co2SavedKg} kg CO₂</strong> grâce à une filière locale de traitement.
              </p>
            </div>

            <button
              id="btn-new-scan"
              onClick={handleStartScan}
              className="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
            >
              <RefreshCw size={12} className="text-emerald-600" />
              Faire un autre dépôt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
