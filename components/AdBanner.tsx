
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Props {
  className?: string;
  type?: 'banner' | 'rectangle';
}

const AdBanner: React.FC<Props> = ({ className = '', type = 'banner' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white group cursor-pointer ${className}`}>
      {/* Simulation of ca-app-pub-6078973010995432/7316243969 */}
      <div className="absolute top-1 right-1 bg-slate-100 text-[8px] font-bold text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-tighter z-10">
        AD
      </div>
      
      <div className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
          <ExternalLink size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-slate-800 truncate">Boost Your Focus Today</h4>
          <p className="text-xs text-slate-500 truncate">Premium resources for elite students worldwide.</p>
        </div>
        <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg group-hover:bg-indigo-600 transition-colors">
          OPEN
        </button>
      </div>
      
      {/* Visual background element */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-50"></div>
    </div>
  );
};

export default AdBanner;
