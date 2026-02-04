
import React from 'react';
import { BmiCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ShareCardProps {
  bmi: number;
  category: BmiCategory;
  date: string;
  name: string;
  onClose: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ bmi, category, date, name, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-white rounded-[3rem] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-10 text-center bg-gradient-to-br from-indigo-50 via-white to-white">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6 rotate-3">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Zenith Wellness</h2>
          <p className="text-[10px] text-indigo-500 mb-10 uppercase tracking-[0.3em] font-black">Daily Performance Card</p>
          
          <div className="mb-10 relative">
            <div className="text-7xl font-black mb-2 tracking-tighter" style={{ color: CATEGORY_COLORS[category] }}>
              {bmi}
            </div>
            <div className="inline-block px-6 py-2 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg" style={{ backgroundColor: CATEGORY_COLORS[category] }}>
              {category}
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-500 border-t border-dashed border-gray-200 pt-8">
            <div className="flex justify-between items-center px-4">
              <span className="font-bold uppercase text-[10px] tracking-widest">Athlete</span>
              <span className="font-black text-black text-base">{name || 'Zenith Member'}</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <span className="font-bold uppercase text-[10px] tracking-widest">Date</span>
              <span className="font-black text-black">{date}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-600 p-6 text-center">
          <p className="text-[10px] text-white/70 uppercase font-black tracking-widest mb-4">Screenshot to inspire others</p>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-indigo-600 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-lg"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
