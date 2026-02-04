
import React from 'react';
import { BmiCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface BmiGaugeProps {
  bmi: number;
  category: BmiCategory;
}

const BmiGauge: React.FC<BmiGaugeProps> = ({ bmi, category }) => {
  const min = 15;
  const max = 40;
  const percentage = Math.min(Math.max(((bmi - min) / (max - min)) * 100, 0), 100);
  const color = CATEGORY_COLORS[category];

  return (
    <div className="flex flex-col items-center w-full my-6 bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative group overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      
      <div className="relative w-full h-16 bg-gray-50 rounded-[2rem] overflow-hidden mb-8 border-4 border-white shadow-inner flex">
        {/* Status Indicators */}
        <div className="absolute inset-0 flex">
          <div className="h-full bg-blue-500/10 border-r border-white/20" style={{ width: '14%' }}></div>
          <div className="h-full bg-green-500/10 border-r border-white/20" style={{ width: '26%' }}></div>
          <div className="h-full bg-amber-500/10 border-r border-white/20" style={{ width: '20%' }}></div>
          <div className="h-full bg-red-500/10" style={{ width: '40%' }}></div>
        </div>
        
        {/* Needle/Cursor */}
        <div 
          className="absolute top-0 bottom-0 w-4 transition-all duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1) z-10 flex flex-col items-center"
          style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-4 h-full shadow-lg rounded-full border-4 border-white" style={{ backgroundColor: color }} />
        </div>
      </div>

      <div className="text-center relative z-10">
        <div className="flex items-baseline justify-center gap-1 group-hover:scale-110 transition-transform duration-500">
          <span className="text-7xl font-black tracking-tighter" style={{ color }}>{bmi || '--'}</span>
          <span className="text-base font-black text-gray-300 uppercase tracking-[0.3em]">BMI</span>
        </div>
        <div className="mt-4">
          <span className="inline-block px-8 py-2 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-lg transform group-hover:-translate-y-1 transition-all duration-300" style={{ backgroundColor: color }}>
            {category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BmiGauge;
