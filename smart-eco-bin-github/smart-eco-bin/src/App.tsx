/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import { Bin, Deposit, Reward, UserStats, BinType } from './types';
import { 
  INITIAL_BINS, 
  INITIAL_DEPOSITS, 
  INITIAL_REWARDS, 
  INITIAL_STATS 
} from './mockData';

export default function App() {
  // App states loaded from localStorage or initialized with mock values
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(1420); // Lifetime points to compute level
  const [bins, setBins] = useState<Bin[]>(INITIAL_BINS);
  const [deposits, setDeposits] = useState<Deposit[]>(INITIAL_DEPOSITS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);

  // Load state on mount
  useEffect(() => {
    const cachedStats = localStorage.getItem('smart_eco_stats');
    const cachedAccumulated = localStorage.getItem('smart_eco_accumulated_points');
    const cachedBins = localStorage.getItem('smart_eco_bins');
    const cachedDeposits = localStorage.getItem('smart_eco_deposits');
    const cachedRewards = localStorage.getItem('smart_eco_rewards');

    if (cachedStats) setStats(JSON.parse(cachedStats));
    if (cachedAccumulated) setAccumulatedPoints(Number(cachedAccumulated));
    if (cachedBins) setBins(JSON.parse(cachedBins));
    if (cachedDeposits) setDeposits(JSON.parse(cachedDeposits));
    if (cachedRewards) setRewards(JSON.parse(cachedRewards));
  }, []);

  // Save states to localStorage whenever they change
  const saveToStorage = (
    newStats: UserStats, 
    newAccumulated: number, 
    newBins: Bin[], 
    newDeposits: Deposit[], 
    newRewards: Reward[]
  ) => {
    localStorage.setItem('smart_eco_stats', JSON.stringify(newStats));
    localStorage.setItem('smart_eco_accumulated_points', String(newAccumulated));
    localStorage.setItem('smart_eco_bins', JSON.stringify(newBins));
    localStorage.setItem('smart_eco_deposits', JSON.stringify(newDeposits));
    localStorage.setItem('smart_eco_rewards', JSON.stringify(newRewards));
  };

  // Centralised transaction when user deposits waste
  const handleSimulateDeposit = (category: BinType, weightGrams: number, points: number, itemName: string) => {
    // 1. Calculate CO2 saved
    let co2Multiplier = 0.0015; // kg CO2 per gram as standard fallback
    if (category === 'plastic') co2Multiplier = 0.003;
    if (category === 'glass') co2Multiplier = 0.002;
    if (category === 'organic') co2Multiplier = 0.0005;
    if (category === 'paper') co2Multiplier = 0.0015;

    const co2Saved = Number(((weightGrams * co2Multiplier)).toFixed(2));

    // 2. Compute level gamification based on lifetime accumulated points
    const nextAccumulated = accumulatedPoints + points;
    const computedLevel = Math.floor(nextAccumulated / 500) + 1;
    const computedProgress = Math.round(((nextAccumulated % 500) / 500) * 100);

    // 3. Update User Statistics
    const updatedStats: UserStats = {
      points: stats.points + points,
      ecoScore: Math.min(100, stats.ecoScore + 1), // increment eco score on each deposit
      totalCarbonSavedKg: stats.totalCarbonSavedKg + co2Saved,
      level: computedLevel,
      levelProgress: computedProgress,
      totalDepositsCount: stats.totalDepositsCount + 1,
    };

    // 4. Update Bin status (Simulate filling the selected category in nearby bins)
    const updatedBins = bins.map((bin) => {
      if (bin.type === category) {
        // Increment fill level by a small proportion relative to weight
        const addedFill = Math.min(20, Math.max(2, Math.round(weightGrams / 50)));
        return {
          ...bin,
          fillLevel: Math.min(100, bin.fillLevel + addedFill),
        };
      }
      return bin;
    });

    // 5. Create deposit entry
    const newDeposit: Deposit = {
      id: `dep_${Date.now()}`,
      timestamp: new Date().toISOString(),
      binType: category,
      itemName: itemName,
      weightGrams: weightGrams,
      pointsEarned: points,
      co2SavedKg: co2Saved,
    };

    const updatedDeposits = [newDeposit, ...deposits];

    // Apply & Save State
    setStats(updatedStats);
    setAccumulatedPoints(nextAccumulated);
    setBins(updatedBins);
    setDeposits(updatedDeposits);

    saveToStorage(updatedStats, nextAccumulated, updatedBins, updatedDeposits, rewards);
  };

  // Transaction when user redeems a voucher
  const handleRedeemReward = (rewardId: string, costPoints: number) => {
    if (stats.points < costPoints) return;

    // Deduct points
    const updatedStats: UserStats = {
      ...stats,
      points: stats.points - costPoints,
    };

    // Mark reward as redeemed and generate unique coupon code
    const updatedRewards = rewards.map((rew) => {
      if (rew.id === rewardId) {
        const randomCode = `SMART-${Math.floor(1000 + Math.random() * 9000)}`;
        return {
          ...rew,
          isRedeemed: true,
          code: randomCode,
        };
      }
      return rew;
    });

    setStats(updatedStats);
    setRewards(updatedRewards);

    saveToStorage(updatedStats, accumulatedPoints, bins, deposits, updatedRewards);
  };

  // Reset function to default demo state
  const handleResetDemo = () => {
    localStorage.removeItem('smart_eco_stats');
    localStorage.removeItem('smart_eco_accumulated_points');
    localStorage.removeItem('smart_eco_bins');
    localStorage.removeItem('smart_eco_deposits');
    localStorage.removeItem('smart_eco_rewards');

    setStats(INITIAL_STATS);
    setAccumulatedPoints(1420);
    setBins(INITIAL_BINS);
    setDeposits(INITIAL_DEPOSITS);
    setRewards(INITIAL_REWARDS);
  };

  return (
    <AppLayout 
      stats={stats}
      bins={bins}
      deposits={deposits}
      rewards={rewards}
      onSimulateDeposit={handleSimulateDeposit}
      onRedeemReward={handleRedeemReward}
      onResetDemo={handleResetDemo}
    />
  );
}
