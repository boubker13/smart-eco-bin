/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Database, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Info, 
  Settings, 
  Lock,
  Link2
} from 'lucide-react';
import { SUPABASE_SQL_BLUEPRINT } from '../mockData';

interface SupabaseViewProps {
  onResetDemo: () => void;
}

export default function SupabaseView({ onResetDemo }: SupabaseViewProps) {
  const [copied, setCopied] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_BLUEPRINT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseAnonKey) return;
    setIsConnected(true);
  };

  const tsCodeSnippet = `// Initialisation de Supabase (src/lib/supabase.ts)
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types_supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exemple de requête de dépôt (src/services/deposits.ts)
export async function createDeposit(depositData) {
  const { data, error } = await supabase
    .from('deposits')
    .insert([depositData])
    .select();
  return { data, error };
}`;

  return (
    <div className="flex-1 p-6 space-y-5 flex flex-col h-full">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
          <Database className="text-emerald-600 animate-pulse" size={20} />
          Intégration Supabase
        </h2>
        <p className="text-xs text-gray-500">
          Cette application est entièrement conçue pour s'interfacer facilement avec une base PostgreSQL Supabase.
        </p>
      </div>

      {/* Connection simulator */}
      <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <h3 className="text-xs font-bold text-gray-900">
              Statut de la base : {isConnected ? 'Connecté (Simulation)' : 'Mode Démo Locale'}
            </h3>
          </div>
          {isConnected && (
            <button 
              onClick={() => { setIsConnected(false); setSupabaseUrl(''); setSupabaseAnonKey(''); }}
              className="text-[10px] text-red-500 hover:underline"
            >
              Déconnecter
            </button>
          )}
        </div>

        {!isConnected ? (
          <form onSubmit={handleConnect} className="space-y-2.5 pt-1">
            <p className="text-[10px] text-gray-500 leading-normal">
              Entrez des clés fictives pour tester le basculement en mode réseau :
            </p>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1"
            >
              <Link2 size={12} />
              Simuler la liaison Supabase
            </button>
          </form>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Liaison Activée !
            </span>
            <p className="text-[9px] text-emerald-600 leading-normal">
              Le client API est initialisé. Les requêtes de tri, dépôts, bornes et profils transitent par le SDK Supabase.
            </p>
          </div>
        )}
      </div>

      {/* SQL Script segment */}
      <div className="space-y-2 flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Terminal size={12} /> Schema SQL (Database Setup)
          </h4>
          <button
            onClick={handleCopySql}
            className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check size={12} /> Copié !
              </>
            ) : (
              <>
                <Copy size={12} /> Copier le script
              </>
            )}
          </button>
        </div>

        <div className="relative flex-1 bg-gray-900 rounded-2xl p-4 overflow-y-auto max-h-[160px] font-mono text-[9px] text-gray-300 leading-relaxed border border-gray-950 select-text">
          <pre>{SUPABASE_SQL_BLUEPRINT}</pre>
        </div>
      </div>

      {/* Code Snippet integration preview */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
          <Settings size={12} /> Code TypeScript d’intégration
        </h4>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-[9px] text-emerald-400 overflow-x-auto max-h-[120px] leading-relaxed select-text">
          <pre>{tsCodeSnippet}</pre>
        </div>
      </div>

      {/* Guide Card */}
      <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex gap-2.5">
        <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="text-[11px] font-bold text-blue-900">Architecture de production</h5>
          <p className="text-[10px] text-blue-800 leading-relaxed">
            Ce prototype utilise un typage stricte et des données modifiables sauvegardées en <strong>localStorage</strong>.
            L'intégration Supabase nécessite simplement l'installation du package <code>@supabase/supabase-js</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
