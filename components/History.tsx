import React, { useEffect, useState } from 'react';
import { HistoryItem, UserProfile } from '../types';
import { Calendar, Trash2, ChevronRight, AlertTriangle, User } from 'lucide-react';
import { RISK_COLORS } from '../constants';

interface HistoryProps {
  onSelect: (item: HistoryItem) => void;
  activeProfileId: string;
}

const History: React.FC<HistoryProps> = ({ onSelect, activeProfileId }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('mediscan_history');
    if (stored) {
      try {
        const allItems: HistoryItem[] = JSON.parse(stored);
        // Filter by profile
        const filtered = allItems.filter(item => item.profileId === activeProfileId).reverse();
        setHistory(filtered);
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, [activeProfileId]);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear this profile's log?")) {
      const stored = localStorage.getItem('mediscan_history');
      if (stored) {
        const allItems: HistoryItem[] = JSON.parse(stored);
        const keptItems = allItems.filter(item => item.profileId !== activeProfileId);
        localStorage.setItem('mediscan_history', JSON.stringify(keptItems));
        setHistory([]);
      }
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
        <p>No logs found for this profile.</p>
        <p className="text-sm">Start a triage analysis to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <User size={20} className="text-slate-400"/> Health Log
        </h2>
        <button 
          onClick={clearHistory}
          className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
        >
          <Trash2 size={14} /> Clear Log
        </button>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-start gap-4">
               <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${RISK_COLORS[item.riskLevel].split(' ')[0]}`}>
                 <AlertTriangle size={20} className={RISK_COLORS[item.riskLevel].split(' ')[1]} />
               </div>
               <div>
                 <p className="text-xs text-slate-400 font-medium mb-1">
                   {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </p>
                 <p className="font-semibold text-slate-800 line-clamp-1">{item.preview}</p>
                 <p className="text-sm text-slate-500 mt-1">
                   Risk: <span className={`font-medium ${RISK_COLORS[item.riskLevel].split(' ')[1]}`}>{item.riskLevel}</span>
                 </p>
               </div>
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;