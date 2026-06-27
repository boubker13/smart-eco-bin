/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BinType = 'plastic' | 'glass' | 'organic' | 'paper';

export interface Bin {
  id: string;
  name: string;
  type: BinType;
  fillLevel: number; // percentage 0-100
  address: string;
  distance: string; // e.g., "150m"
}

export interface Deposit {
  id: string;
  timestamp: string;
  binType: BinType;
  itemName: string;
  weightGrams: number;
  pointsEarned: number;
  co2SavedKg: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'voucher' | 'transit' | 'eco-product' | 'donation';
  provider: string;
  logoType: string;
  code?: string;
  isRedeemed?: boolean;
}

export interface UserStats {
  points: number;
  ecoScore: number; // 0-100
  totalCarbonSavedKg: number;
  level: number;
  levelProgress: number; // 0-100
  totalDepositsCount: number;
}
