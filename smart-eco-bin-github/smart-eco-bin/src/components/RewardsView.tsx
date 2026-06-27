/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Gift, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  AlertCircle,
  QrCode,
  Ticket,
  ChevronRight,
  Clock,
  ExternalLink,
  Smartphone,
  Wifi,
  Coins
} from 'lucide-react';
import { Reward, UserStats } from '../types';

interface RewardsViewProps {
  stats: UserStats;
  rewards: Reward[];
  onRedeemReward: (rewardId: string, cost: number) => void;
}

export default function RewardsView({ stats, rewards, onRedeemReward }: RewardsViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'voucher' | 'transit' | 'donation' | 'eco-product'>('all');
  const [activeTab, setActiveTab] = useState<'shop' | 'my-rewards'>('shop');
  const [selectedRewardToRedeem, setSelectedRewardToRedeem] = useState<Reward | null>(null);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'voucher', label: 'Recharges' },
  ];

  const filteredRewards = rewards.filter((rew) => {
    if (activeCategory === 'all') return true;
    return rew.category === activeCategory;
  });

  const handleConfirmRedeem = () => {
    if (!selectedRewardToRedeem) return;
    
    // Call parent handler to deduct points and mark as redeemed
    onRedeemReward(selectedRewardToRedeem.id, selectedRewardToRedeem.pointsCost);
    
    // Generate a simulated promotion code
    const randomCode = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const formattedCode = `*111*${randomCode}#`;
    
    setRedeemedCode(formattedCode);
  };

  const getProviderBadge = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'mobilis':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'djezzy':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'ooredoo':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getRewardIcon = (logoType: string) => {
    switch (logoType) {
      case 'Smartphone':
        return <Smartphone size={16} className="text-amber-500" />;
      case 'Wifi':
        return <Wifi size={16} className="text-amber-500" />;
      default:
        return <Smartphone size={16} className="text-amber-500" />;
    }
  };

  // Get only rewards that are redeemed
  const myRedeemedRewards = rewards.filter(rew => rew.isRedeemed);

  return (
    <div className="flex-1 p-5 space-y-4 flex flex-col h-full bg-slate-50/20 overflow-y-auto scrollbar-none" id="rewards-view-container">
      {/* Top section: Title and subtitle */}
      <div className="flex justify-between items-start" id="rewards-header">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Boutique éco-citoyenne</span>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5 font-display">
            <Gift className="text-emerald-600 animate-pulse" size={18} />
            Bazar des Récompenses
          </h2>
        </div>
      </div>

      {/* Points Ledger / Balance Card */}
      <div 
        id="points-balance-card"
        className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex items-center justify-between"
      >
        <div className="absolute right-[-10px] bottom-[-20px] w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
            <Coins size={10} className="fill-emerald-400/20" />
            Votre Solde Éco Actuel
          </span>
          <span className="text-2xl font-black block tracking-tight font-sans text-yellow-400">
            {stats.points.toLocaleString('fr-FR')} <span className="text-xs font-bold text-white uppercase tracking-wider">Points</span>
          </span>
        </div>
        <div className="bg-white/10 hover:bg-white/15 transition-colors px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/5 font-mono">
          Niveau {stats.level}
        </div>
      </div>

      {/* Tab select bar */}
      <div className="flex border-b border-gray-100 pb-px" id="rewards-tabs">
        <button
          onClick={() => { setActiveTab('shop'); setSelectedRewardToRedeem(null); setRedeemedCode(null); }}
          className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'shop' 
              ? 'border-emerald-600 text-emerald-700' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Boutique Recharges
        </button>
        <button
          onClick={() => { setActiveTab('my-rewards'); setSelectedRewardToRedeem(null); setRedeemedCode(null); }}
          className={`flex-1 text-center py-2 text-xs font-bold transition-all border-b-2 relative ${
            activeTab === 'my-rewards' 
              ? 'border-emerald-600 text-emerald-700' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Mes Recharges débloquées
          {myRedeemedRewards.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white rounded-full text-[8px] font-bold">
              {myRedeemedRewards.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'shop' ? (
        <>
          {/* Bazar des Récompenses - 2 columns grid */}
          <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto max-h-[380px] pr-1" id="bazar-grid">
            {filteredRewards.map((reward) => {
              const canAfford = stats.points >= reward.pointsCost;
              return (
                <div 
                  key={reward.id}
                  className="p-3 bg-white border border-gray-100 rounded-2xl shadow-xs flex flex-col justify-between hover:border-gray-200 transition-all duration-250 hover:shadow-sm"
                >
                  <div className="space-y-1.5">
                    {/* Header: Provider badge & cost */}
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[8px] font-extrabold border px-1.5 py-0.5 rounded-md uppercase tracking-wider ${getProviderBadge(reward.provider)}`}>
                        {reward.provider}
                      </span>
                      {getRewardIcon(reward.logoType)}
                    </div>

                    {/* Title */}
                    <h4 className="text-[11px] font-extrabold text-gray-900 leading-tight">
                      {reward.title}
                    </h4>

                    {/* Description */}
                    <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>

                  {/* Footer & CTA */}
                  <div className="mt-3 pt-2.5 border-t border-gray-50 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[9px]">
                      <span className="text-gray-400 font-medium">Prix :</span>
                      <span className="font-extrabold text-amber-500 font-mono">
                        {reward.pointsCost} pts
                      </span>
                    </div>

                    <button
                      disabled={!canAfford}
                      onClick={() => { setSelectedRewardToRedeem(reward); setRedeemedCode(null); }}
                      className={`w-full py-1.5 rounded-lg text-[10px] font-bold text-center transition-all ${
                        canAfford 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95 cursor-pointer' 
                          : 'bg-gray-100 text-gray-400 border border-gray-200/40 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Échanger' : 'Points insuffisants'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* My Redeemed Rewards tab */
        <div className="space-y-3 flex-1 overflow-y-auto max-h-[440px] pr-1" id="my-rewards-container">
          {myRedeemedRewards.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-2 bg-white rounded-2xl border border-gray-100">
              <Ticket size={28} className="mx-auto text-gray-200 stroke-[1.5]" />
              <p className="text-xs font-bold text-gray-500">Aucun code de recharge encore débloqué</p>
              <p className="text-[9px] text-gray-400 max-w-[180px] mx-auto">Triez vos emballages à la borne SmartBin pour cumuler vos points !</p>
            </div>
          ) : (
            myRedeemedRewards.map((reward) => (
              <div 
                key={reward.id}
                className="p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Prêt à activer
                    </span>
                    <h4 className="text-xs font-bold text-gray-900 mt-1">{reward.title}</h4>
                    <p className="text-[9px] text-gray-400 font-medium">Opérateur : {reward.provider}</p>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-extrabold text-gray-800 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-150 font-mono">
                      {reward.code || '*111*5538102928#'}
                    </span>
                  </div>
                </div>

                {/* Simulated USSD code details */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100/50 flex flex-col items-center justify-center space-y-1.5">
                  <div className="w-full text-center py-1 font-mono text-[11px] text-emerald-800 font-black tracking-wider bg-white border border-emerald-100 rounded">
                    {reward.code || '*111*5538102928#'}
                  </div>
                  <span className="text-[8px] text-gray-400 text-center uppercase tracking-widest font-bold">
                    Composez ce code USSD sur votre mobile pour activer le crédit
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Redemption Confirmation Modal overlay */}
      {selectedRewardToRedeem && (
        <div className="absolute inset-0 bg-gray-950/65 backdrop-blur-xs z-50 flex items-end justify-center">
          <div className="w-full bg-white rounded-t-[32px] p-5 space-y-4 animate-slide-up border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto" />
            
            {!redeemedCode ? (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-sm font-bold text-gray-900">Confirmer l'échange</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Le coût sera déduit de votre Solde Écologique.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100/60">
                  <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${getProviderBadge(selectedRewardToRedeem.provider)}`}>
                    {selectedRewardToRedeem.provider}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 mt-1.5">{selectedRewardToRedeem.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{selectedRewardToRedeem.description}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-[10px] font-medium">
                    <span className="text-gray-400">Déduction</span>
                    <span className="font-extrabold text-amber-500 font-mono">-{selectedRewardToRedeem.pointsCost} Points</span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setSelectedRewardToRedeem(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-150 text-gray-700 rounded-xl text-xs font-bold text-center active:scale-95 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmRedeem}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center shadow-sm active:scale-95 transition-all"
                  >
                    Confirmer (+ Code USSD)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="w-11 h-11 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 font-display">Échange validé !</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Votre recharge de crédit d'appel / forfait internet est prête.
                  </p>
                </div>

                {/* USSD code output with elegant copy/view */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-150 flex flex-col items-center justify-center space-y-2">
                  <Smartphone className="text-emerald-600 animate-bounce" size={24} />
                  <p className="text-xs text-gray-500 font-semibold uppercase">Votre code d’activation :</p>
                  <span className="text-sm font-mono font-black tracking-wider bg-white px-3.5 py-1.5 rounded-lg border border-emerald-100 text-emerald-800 shadow-xs">
                    {redeemedCode}
                  </span>
                  <p className="text-[8px] text-gray-400 italic">Prenez une capture d’écran ou copiez ce code pour votre téléphone.</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRewardToRedeem(null);
                    setRedeemedCode(null);
                    setActiveTab('my-rewards');
                  }}
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  Fermer & voir mon code
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
