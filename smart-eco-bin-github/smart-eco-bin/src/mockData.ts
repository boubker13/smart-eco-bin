/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Bin, Deposit, Reward, UserStats, BinType } from './types';

export const INITIAL_BINS: Bin[] = [
  {
    id: 'bin_1',
    name: 'Borne République - Plastique & Métal',
    type: 'plastic',
    fillLevel: 42,
    address: '12 Rue de la République',
    distance: '85m',
  },
  {
    id: 'bin_2',
    name: 'Collecteur Place des Vosges - Verre',
    type: 'glass',
    fillLevel: 78,
    address: '5 Place des Vosges',
    distance: '140m',
  },
  {
    id: 'bin_3',
    name: 'Bio-Composteur Voltaire - Organique',
    type: 'organic',
    fillLevel: 18,
    address: '24 Boulevard Voltaire',
    distance: '310m',
  },
  {
    id: 'bin_4',
    name: 'Bac de Tri Carnot - Papier & Carton',
    type: 'paper',
    fillLevel: 55,
    address: '8 Avenue Carnot',
    distance: '450m',
  },
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew_1',
    title: 'Recharge Flexy 500 DA',
    description: 'Recharge Mobilis Flexy crédit d’appel ou internet 3G/4G.',
    pointsCost: 150,
    category: 'voucher',
    provider: 'Mobilis',
    logoType: 'Smartphone',
  },
  {
    id: 'rew_2',
    title: 'Recharge Djezzy 1000 DA',
    description: 'Crédit d’appel national et internet haut débit 4G.',
    pointsCost: 300,
    category: 'voucher',
    provider: 'Djezzy',
    logoType: 'Smartphone',
  },
  {
    id: 'rew_3',
    title: 'Recharge Ooredoo 500 DA',
    description: 'Recharge Ooredoo Storm crédit national d’appel et internet.',
    pointsCost: 150,
    category: 'voucher',
    provider: 'Ooredoo',
    logoType: 'Smartphone',
  },
  {
    id: 'rew_4',
    title: 'Recharge Mobilis 1000 DA',
    description: 'Recharge Mobilis Flexy crédit d’appel ou forfait data internet.',
    pointsCost: 300,
    category: 'voucher',
    provider: 'Mobilis',
    logoType: 'Smartphone',
  },
  {
    id: 'rew_5',
    title: 'Forfait Data 2 Go Ooredoo',
    description: 'Recharge internet ultra-rapide 4G valable pendant 30 jours.',
    pointsCost: 100,
    category: 'voucher',
    provider: 'Ooredoo',
    logoType: 'Wifi',
  },
  {
    id: 'rew_6',
    title: 'Recharge Djezzy 500 DA',
    description: 'Recharge Djezzy crédit d’appel ou forfait data internet.',
    pointsCost: 150,
    category: 'voucher',
    provider: 'Djezzy',
    logoType: 'Smartphone',
  },
];

export const INITIAL_DEPOSITS: Deposit[] = [
  {
    id: 'dep_1',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2 hours ago
    binType: 'plastic',
    itemName: 'Bouteille PET 1.5L',
    weightGrams: 45,
    pointsEarned: 15,
    co2SavedKg: 0.14,
  },
  {
    id: 'dep_2',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // Yesterday
    binType: 'glass',
    itemName: 'Pot de confiture vide',
    weightGrams: 220,
    pointsEarned: 20,
    co2SavedKg: 0.45,
  },
  {
    id: 'dep_3',
    timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(), // 3 days ago
    binType: 'organic',
    itemName: 'Restes de légumes & marc de café',
    weightGrams: 650,
    pointsEarned: 10,
    co2SavedKg: 0.32,
  },
  {
    id: 'dep_4',
    timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(), // 5 days ago
    binType: 'paper',
    itemName: 'Revues & cartons d’expédition',
    weightGrams: 1100,
    pointsEarned: 35,
    co2SavedKg: 0.88,
  },
];

export const INITIAL_STATS: UserStats = {
  points: 420,
  ecoScore: 84,
  totalCarbonSavedKg: 12.4,
  level: 3,
  levelProgress: 40, // 40% towards level 4
  totalDepositsCount: 14,
};

// PRESET waste objects for scanning simulations
export interface WastePreset {
  id: string;
  name: string;
  category: BinType;
  weightGrams: number;
  points: number;
  co2SavedKg: number;
  tip: string;
}

export const WASTE_PRESETS: WastePreset[] = [
  {
    id: 'p_1',
    name: 'Bouteille d’eau minérale',
    category: 'plastic',
    weightGrams: 30,
    points: 15,
    co2SavedKg: 0.09,
    tip: 'Laissez le bouchon vissé dessus, il se recycle aussi ! Ne pas rincer inutilement.',
  },
  {
    id: 'p_2',
    name: 'Canette de soda en aluminium',
    category: 'plastic',
    weightGrams: 15,
    points: 15,
    co2SavedKg: 0.12,
    tip: 'L’aluminium est recyclable à l’infini. Écrasez-la pour gagner de la place.',
  },
  {
    id: 'p_3',
    name: 'Bouteille de vin en verre',
    category: 'glass',
    weightGrams: 400,
    points: 25,
    co2SavedKg: 0.60,
    tip: 'Retirez le bouchon en liège ou plastique. Pas besoin d’enlever l’étiquette.',
  },
  {
    id: 'p_4',
    name: 'Bocal en verre (sans couvercle)',
    category: 'glass',
    weightGrams: 200,
    points: 20,
    co2SavedKg: 0.38,
    tip: 'Le couvercle en métal va dans la borne plastique/métal, le bocal va dans le verre.',
  },
  {
    id: 'p_5',
    name: 'Boîte en carton de céréales',
    category: 'paper',
    weightGrams: 120,
    points: 20,
    co2SavedKg: 0.18,
    tip: 'Pensez à bien aplatir le carton. Retirez le sachet plastique intérieur.',
  },
  {
    id: 'p_6',
    name: 'Journal ou magazine',
    category: 'paper',
    weightGrams: 250,
    points: 15,
    co2SavedKg: 0.25,
    tip: 'Ne jetez pas les films plastiques d’envoi avec, uniquement le papier propre.',
  },
  {
    id: 'p_7',
    name: 'Marc de café et filtres',
    category: 'organic',
    weightGrams: 100,
    points: 10,
    co2SavedKg: 0.05,
    tip: 'Le filtre en papier blanc ou brun est 100% compostable avec le marc.',
  },
  {
    id: 'p_8',
    name: 'Épluchures de fruits',
    category: 'organic',
    weightGrams: 300,
    points: 10,
    co2SavedKg: 0.15,
    tip: 'Excellent pour enrichir le compost de matières azotées.',
  },
];

// Supabase SQL Blueprint code
export const SUPABASE_SQL_BLUEPRINT = `-- Schéma SQL de base pour l'application Smart Eco Bin
-- Prêt à être exécuté dans l'éditeur SQL de votre projet Supabase

-- 1. Table des utilisateurs (profil étendu de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT UNIQUE,
  points INTEGER DEFAULT 0 NOT NULL,
  eco_score INTEGER DEFAULT 50 NOT NULL,
  total_carbon_saved_kg NUMERIC(10,2) DEFAULT 0.00 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  level_progress INTEGER DEFAULT 0 NOT NULL,
  total_deposits_count INTEGER DEFAULT 0 NOT NULL,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Active le RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les profils" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Table des bornes de recyclage (bins)
CREATE TABLE public.bins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('plastic', 'glass', 'organic', 'paper')),
  fill_level INTEGER DEFAULT 0 NOT NULL CHECK (fill_level >= 0 AND fill_level <= 100),
  address TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.bins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tout le monde peut voir les bornes" 
  ON public.bins FOR SELECT USING (true);

-- 3. Table des dépôts de déchets (deposits)
CREATE TABLE public.deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  bin_id UUID REFERENCES public.bins(id) ON DELETE SET NULL,
  bin_type TEXT NOT NULL CHECK (bin_type IN ('plastic', 'glass', 'organic', 'paper')),
  item_name TEXT NOT NULL,
  weight_grams INTEGER NOT NULL,
  points_earned INTEGER NOT NULL,
  co2_saved_kg NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs voient leurs propres dépôts" 
  ON public.deposits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent insérer leurs dépôts" 
  ON public.deposits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Table des récompenses (rewards)
CREATE TABLE public.rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_cost INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('voucher', 'transit', 'eco-product', 'donation')),
  provider TEXT NOT NULL,
  logo_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table pivot d'achats de récompenses par utilisateur (user_rewards)
CREATE TABLE public.user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reward_id UUID REFERENCES public.rewards(id) ON DELETE CASCADE NOT NULL,
  promo_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Les utilisateurs voient leurs propres récompenses achetées" 
  ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);

-- Déclencheur pour créer automatiquement un profil à l'inscription auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, points, eco_score, total_carbon_saved_kg, level, level_progress, total_deposits_count)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', 'eco_user_' || substr(new.id::text, 1, 5)),
    0, 80, 0.0, 1, 0, 0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;
