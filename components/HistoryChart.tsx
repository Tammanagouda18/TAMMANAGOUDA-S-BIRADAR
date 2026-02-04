
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryRecord } from '../types';

interface HistoryChartProps {
  data: HistoryRecord[];
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/50">
        <div className="text-3xl mb-2 grayscale opacity-30">📉</div>
        <p className="text-xs font-black uppercase tracking-widest">No Trend Data</p>
      </div>
    );
  }

  const chartData = [...data].reverse().map(record => ({
    ...record,
    date: new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
          />
          <YAxis 
            hide={true} 
            domain={['dataMin - 1', 'dataMax + 1']} 
          />
          <Tooltip 
            cursor={{ stroke: '#4f46e5', strokeWidth: 1 }}
            contentStyle={{ 
              borderRadius: '24px', 
              border: 'none', 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
              padding: '12px 16px',
              fontWeight: 900,
              fontSize: '12px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="bmi" 
            stroke="#4f46e5" 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#colorBmi)" 
            dot={{ fill: '#4f46e5', r: 5, strokeWidth: 3, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0 }} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HistoryChart;
