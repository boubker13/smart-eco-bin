/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Trash2, 
  Radio, 
  Loader2, 
  Wifi, 
  CheckCircle2,
  Compass,
  ChevronUp,
  Info,
  Maximize2
} from 'lucide-react';
import { Bin, BinType } from '../types';

interface MapViewProps {
  bins: Bin[];
  onSimulateDeposit: (category: BinType, weight: number, points: number, itemName: string) => void;
}

export default function MapView({ bins, onSimulateDeposit }: MapViewProps) {
  // Let's model the 3 bins required: Centre-ville, Université, Mansourah
  // We'll map them from the existing bins or ensure we have exact representations.
  const [selectedBinId, setSelectedBinId] = useState<string>('bin-1'); // Default to first bin
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(true);
  const [nfcState, setNfcState] = useState<'idle' | 'searching' | 'connected' | 'success'>('idle');
  const [nfcProgress, setNfcProgress] = useState(0);

  // Define exact 3 bins asked by user to display in nearby list
  const activeMapBins = [
    {
      id: 'bin-1',
      name: 'Centre-ville - Place Centrale',
      type: 'glass' as BinType,
      fillLevel: 88, // Almost full -> Rouge
      distance: '180 m',
      address: 'Place de l\'Hôtel de Ville, Secteur Piéton',
      coords: { x: '52%', top: '35%' },
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-500',
      ringColor: 'ring-rose-500/30'
    },
    {
      id: 'bin-2',
      name: 'Université - Campus Nord',
      type: 'plastic' as BinType,
      fillLevel: 58, // Medium -> Jaune
      distance: '320 m',
      address: 'Allée des Sciences, Face à la Bibliothèque',
      coords: { x: '24%', top: '55%' },
      colorClass: 'text-yellow-500',
      bgClass: 'bg-yellow-500',
      ringColor: 'ring-yellow-500/30'
    },
    {
      id: 'bin-3',
      name: 'Quartier Mansourah - Rue 4',
      type: 'organic' as BinType,
      fillLevel: 24, // Low -> Vert
      distance: '750 m',
      address: 'Avenue de la Liberté, Proche Boulangerie',
      coords: { x: '78%', top: '22%' },
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500',
      ringColor: 'ring-emerald-500/30'
    }
  ];

  const selectedBin = activeMapBins.find(b => b.id === selectedBinId) || activeMapBins[0];

  const startNfcPairing = () => {
    setNfcState('searching');
    setNfcProgress(0);

    const interval = setInterval(() => {
      setNfcProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setNfcState('connected');
          
          // Open lid after brief delay and complete
          setTimeout(() => {
            setNfcState('success');
            // Log a physical deposit action automatically
            const weight = Math.floor(Math.random() * 400) + 150; // 150g - 550g
            const points = Math.max(15, Math.round((weight / 100) * 5));
            const itemName = `Dépôt NFC - ${selectedBin.name.split(' - ')[0]}`;
            onSimulateDeposit(selectedBin.type, weight, points, itemName);
          }, 1200);

          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  // Helper to determine color category based on fill level
  const getFillLevelColor = (level: number) => {
    if (level >= 80) return { text: 'text-rose-500', bg: 'bg-rose-500', label: 'Plein' };
    if (level >= 40) return { text: 'text-yellow-600', bg: 'bg-yellow-500', label: 'Intermédiaire' };
    return { text: 'text-emerald-600', bg: 'bg-emerald-500', label: 'Disponible' };
  };

  return (
    <div className="relative h-[650px] w-full overflow-hidden bg-slate-100 flex flex-col" id="map-view-container">
      {/* 1. Map Image background (fictive street layout using Unsplash) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&h=800&q=80" 
          alt="Plan de la ville fictive"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-85 filter grayscale brightness-[0.98] contrast-[1.02]"
        />
        {/* Soft elegant grid overlay */}
        <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />
      </div>

      {/* Floating search & current location banner on top */}
      <div className="absolute top-4 left-4 right-4 z-10 space-y-2">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-2.5 flex items-center gap-3">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Rechercher une borne ou adresse..."
            className="bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none w-full font-medium"
            disabled
          />
          <button className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
            <Navigation size={14} className="fill-emerald-700/20" />
          </button>
        </div>
      </div>

      {/* 2. Superposed 3 Pins (green, yellow, red) representing the fill level */}
      {activeMapBins.map((bin) => {
        const isSelected = selectedBinId === bin.id;
        const status = getFillLevelColor(bin.fillLevel);
        return (
          <button
            key={bin.id}
            onClick={() => {
              setSelectedBinId(bin.id);
              setNfcState('idle');
              setIsSheetExpanded(true);
            }}
            className="absolute transition-all duration-300 z-10"
            style={{ left: bin.coords.x, top: bin.coords.top }}
          >
            <div className="relative group flex flex-col items-center">
              {/* Outer pulse effect */}
              <span className={`absolute -inset-1.5 rounded-full ${bin.ringColor} animate-ping opacity-60`} />
              
              {/* Pin design */}
              <div className={`p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center transition-transform duration-300 ${
                isSelected ? 'scale-125 z-20 ring-4 ring-slate-900/10' : 'hover:scale-110'
              } ${bin.bgClass}`}>
                <MapPin size={15} className="text-white fill-white/10" />
              </div>

              {/* Minimal floating name tag above selected pin */}
              {isSelected && (
                <div className="absolute bottom-10 bg-gray-900 text-white font-semibold text-[9px] py-1 px-2 rounded-lg shadow-md whitespace-nowrap animate-bounce flex items-center gap-1">
                  <span>{bin.name.split(' - ')[0]}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
              )}
            </div>
          </button>
        );
      })}

      {/* 3. BottomSheet panel that slides up from the bottom */}
      <div 
        id="bottom-sheet"
        className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md rounded-t-[32px] shadow-[0_-12px_42px_rgba(15,23,42,0.12)] border-t border-slate-100 z-20 transition-all duration-500 ease-out flex flex-col ${
          isSheetExpanded ? 'max-h-[390px] h-[390px]' : 'max-h-[140px] h-[140px]'
        }`}
      >
        {/* BottomSheet Drag Handle Indicator */}
        <button 
          onClick={() => setIsSheetExpanded(!isSheetExpanded)}
          className="w-full pt-3 pb-2 flex flex-col items-center gap-1"
        >
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
          <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400">
            {isSheetExpanded ? 'Réduire le volet' : 'Afficher les bornes'}
          </span>
        </button>

        {/* Selected bin dashboard area inside sheet */}
        <div className="px-5 pb-3 shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wider">
                {getFillLevelColor(selectedBin.fillLevel).label}
              </span>
              <h4 className="text-xs font-extrabold text-gray-900 mt-1">{selectedBin.name}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{selectedBin.address}</p>
            </div>
            <div className="text-right flex flex-col items-end gap-1">
              <span className="text-[11px] font-mono font-bold text-gray-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                {selectedBin.distance}
              </span>
              <span className="text-[9px] text-gray-400 font-medium">À pied</span>
            </div>
          </div>

          {/* Quick NFC pairing triggers from bottom sheet directly for premium immersion */}
          <div className="mt-3">
            {nfcState === 'idle' ? (
              <button
                onClick={startNfcPairing}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <Radio size={13} className="text-emerald-400 animate-pulse" />
                Déposer par NFC (Simuler l'approche)
              </button>
            ) : nfcState === 'searching' ? (
              <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <Loader2 size={14} className="text-emerald-600 animate-spin" />
                  <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
                    Pairage NFC... {nfcProgress}%
                  </span>
                </div>
                <span className="text-[9px] text-gray-400">Approchez votre mobile</span>
              </div>
            ) : nfcState === 'connected' ? (
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center gap-2">
                <Wifi size={14} className="text-emerald-600 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                  Borne connectée • Ouverture clapet...
                </span>
              </div>
            ) : (
              <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[10px]">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Dépôt NFC réussi ! (+50 pts)</span>
                </div>
                <button
                  onClick={() => setNfcState('idle')}
                  className="px-2 py-0.5 bg-white hover:bg-emerald-100 text-[9px] font-bold text-emerald-700 rounded-md border border-emerald-200"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. List of "Poubelles à proximité" (Centre-ville, Université, Mansourah) */}
        {isSheetExpanded && (
          <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3 scrollbar-thin">
            <div className="border-t border-slate-100 pt-3">
              <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                Poubelles à proximité
              </h5>
              
              <div className="space-y-2.5">
                {activeMapBins.map((bin) => {
                  const isSelected = selectedBinId === bin.id;
                  const status = getFillLevelColor(bin.fillLevel);
                  return (
                    <button
                      key={bin.id}
                      onClick={() => {
                        setSelectedBinId(bin.id);
                        setNfcState('idle');
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-slate-50 border-emerald-500/30 shadow-sm ring-1 ring-emerald-500/10' 
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xs'
                      }`}
                    >
                      {/* Name, category & distance */}
                      <div className="flex justify-between items-start w-full">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${bin.bgClass}`} />
                          <span className="text-[11px] font-bold text-gray-900 truncate max-w-[160px]">
                            {bin.name.split(' - ')[0]}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-500">
                          {bin.distance}
                        </span>
                      </div>

                      {/* Fill level progress bar with specific color */}
                      <div className="space-y-1 w-full">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Niveau de remplissage</span>
                          <span className={`font-semibold ${status.text}`}>
                            {bin.fillLevel}% {bin.fillLevel >= 80 ? '(Presque plein)' : ''}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${status.bg}`}
                            style={{ width: `${bin.fillLevel}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
