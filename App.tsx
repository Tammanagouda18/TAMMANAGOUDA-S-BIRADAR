
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  UserProfile, 
  UnitSystem, 
  HistoryRecord, 
  BmiCategory 
} from './types';
import { 
  getProfile, 
  saveProfile, 
  getHistory, 
  saveHistoryRecord, 
  getDefaultProfile,
  clearAllData
} from './services/storage';
import { 
  calculateBmi, 
  getBmiCategory, 
  calculateTargetWeight,
  metricToImperial,
  imperialToMetric
} from './services/bmiLogic';
import { HEALTHY_BMI_TARGET, HEALTH_TIPS, CATEGORY_COLORS, NUTRITION_GUIDE, DAILY_WATER_GOAL } from './constants';
import BmiGauge from './components/BmiGauge';
import HistoryChart from './components/HistoryChart';
import ShareCard from './components/ShareCard';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>(getDefaultProfile());
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'calc' | 'history' | 'profile' | 'nutrition'>('calc');
  const [isSaved, setIsSaved] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [waterCount, setWaterCount] = useState(0);

  const [impFt, setImpFt] = useState(5);
  const [impIn, setImpIn] = useState(7);
  const [impLbs, setImpLbs] = useState(154);

  const [errors, setErrors] = useState<{height?: string; weight?: string}>({});

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      const { ft, inc, lbs } = metricToImperial(savedProfile.height, savedProfile.weight);
      setImpFt(ft);
      setImpIn(inc);
      setImpLbs(lbs);
    }
    setHistory(getHistory());
    
    const today = new Date().toDateString();
    const savedWater = localStorage.getItem(`water_${today}`);
    if (savedWater) setWaterCount(parseInt(savedWater));
  }, []);

  const bmi = useMemo(() => calculateBmi(profile.weight, profile.height), [profile]);
  const category = useMemo(() => getBmiCategory(bmi), [bmi]);
  const target = useMemo(() => calculateTargetWeight(profile.height, profile.weight), [profile]);
  const tips = useMemo(() => HEALTH_TIPS.find(t => t.category === category)?.tips || [], [category]);

  const updateWater = (val: number) => {
    const newVal = Math.max(0, val);
    setWaterCount(newVal);
    localStorage.setItem(`water_${new Date().toDateString()}`, newVal.toString());
  };

  const validate = useCallback((h: number, w: number) => {
    const newErrors: {height?: string; weight?: string} = {};
    if (h <= 0) newErrors.height = "Height must be > 0";
    if (w <= 0) newErrors.weight = "Weight must be > 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleUnitToggle = (unit: UnitSystem) => {
    setProfile(prev => ({ ...prev, unitSystem: unit }));
  };

  const handleMetricChange = (field: 'height' | 'weight', val: number) => {
    const updated = { ...profile, [field]: val };
    setProfile(updated);
    validate(updated.height, updated.weight);
    const { ft, inc, lbs } = metricToImperial(updated.height, updated.weight);
    setImpFt(ft);
    setImpIn(inc);
    setImpLbs(lbs);
    setIsSaved(false);
  };

  const handleImperialChange = (ft: number, inc: number, lbs: number) => {
    setImpFt(isNaN(ft) ? 0 : ft);
    setImpIn(isNaN(inc) ? 0 : inc);
    setImpLbs(isNaN(lbs) ? 0 : lbs);
    const { cm, kg } = imperialToMetric(ft || 0, inc || 0, lbs || 0);
    setProfile(prev => ({ ...prev, height: Math.round(cm), weight: Math.round(kg) }));
    validate(Math.round(cm), Math.round(kg));
    setIsSaved(false);
  };

  const handleSaveResult = () => {
    if (!validate(profile.height, profile.weight)) return;
    const record: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      weight: profile.weight,
      bmi,
      category
    };
    saveHistoryRecord(record);
    setHistory(getHistory());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile(profile);
    setActiveTab('calc');
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-slate-50 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-gray-200 antialiased">
      {showShareCard && (
        <ShareCard 
          bmi={bmi} 
          category={category} 
          date={new Date().toLocaleDateString()} 
          name={profile.name}
          onClose={() => setShowShareCard(false)} 
        />
      )}

      {/* Header */}
      <header className="px-8 pt-12 pb-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center gap-4">
          {activeTab !== 'calc' && (
            <button 
              onClick={() => setActiveTab('calc')}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-900 hover:bg-gray-200 transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-indigo-100 rotate-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">Zenith</h1>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1">Health Matrix</p>
            </div>
          </div>
        </div>
        <button onClick={() => setActiveTab('profile')} className="w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all active:scale-95 border border-gray-100 shadow-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 pb-36 overflow-y-auto no-scrollbar scroll-smooth">
        {activeTab === 'calc' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pt-8">
            {/* Unit Toggle */}
            <div className="flex bg-gray-200/50 p-1.5 rounded-[1.5rem] shadow-inner">
              <button 
                onClick={() => handleUnitToggle(UnitSystem.METRIC)}
                className={`flex-1 py-3.5 rounded-[1rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${profile.unitSystem === UnitSystem.METRIC ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Metric
              </button>
              <button 
                onClick={() => handleUnitToggle(UnitSystem.IMPERIAL)}
                className={`flex-1 py-3.5 rounded-[1rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${profile.unitSystem === UnitSystem.IMPERIAL ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Imperial
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-6">
              {profile.unitSystem === UnitSystem.METRIC ? (
                <>
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-indigo-100 transition-colors">
                    <div className="flex justify-between items-center mb-5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stature</label>
                      <span className="text-2xl font-black text-indigo-600">{profile.height} <small className="text-[10px] text-gray-400">cm</small></span>
                    </div>
                    <input 
                      type="range" min="100" max="250" step="1"
                      value={profile.height}
                      onChange={(e) => handleMetricChange('height', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer custom-slider"
                    />
                  </div>
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-indigo-100 transition-colors">
                    <div className="flex justify-between items-center mb-5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mass</label>
                      <span className="text-2xl font-black text-indigo-600">{profile.weight} <small className="text-[10px] text-gray-400">kg</small></span>
                    </div>
                    <input 
                      type="range" min="30" max="200" step="1"
                      value={profile.weight}
                      onChange={(e) => handleMetricChange('weight', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer custom-slider"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-5">
                   <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Feet</label>
                        <input 
                          type="number" value={impFt} onChange={(e) => handleImperialChange(parseInt(e.target.value), impIn, impLbs)}
                          className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-xl font-black text-indigo-600 focus:ring-2 focus:ring-indigo-400 shadow-inner"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Inches</label>
                        <input 
                          type="number" value={impIn} onChange={(e) => handleImperialChange(impFt, parseInt(e.target.value), impLbs)}
                          className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-xl font-black text-indigo-600 focus:ring-2 focus:ring-indigo-400 shadow-inner"
                        />
                      </div>
                   </div>
                   <div className="bg-white p-7 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Weight (lbs)</label>
                    <input 
                      type="number" value={impLbs} onChange={(e) => handleImperialChange(impFt, impIn, parseInt(e.target.value))}
                      className="w-full bg-gray-50 border-0 rounded-2xl p-5 text-4xl font-black text-indigo-600 focus:ring-2 focus:ring-indigo-400 shadow-inner"
                    />
                   </div>
                </div>
              )}
            </div>

            {/* BMI Gauge */}
            <BmiGauge bmi={bmi} category={category} />

            {/* Hydration Monitor */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
               <div className="relative z-10">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter">Hydration</h3>
                      <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest opacity-70">Goal: {DAILY_WATER_GOAL} glasses</p>
                    </div>
                    <div className="w-14 h-14 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/10">
                       <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: DAILY_WATER_GOAL }).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => updateWater(i < waterCount ? i : i + 1)}
                        className={`aspect-square rounded-[1.25rem] flex items-center justify-center transition-all duration-300 transform active:scale-90 ${i < waterCount ? 'bg-white text-blue-600 shadow-xl scale-105' : 'bg-blue-400/30 text-white/40 border border-white/10 hover:bg-blue-400/50'}`}
                      >
                         <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.5C8.41 21.5 5.5 18.59 5.5 15c0-1.89 1.14-3.51 2.5-5 1.5-1.64 4-5.5 4-5.5s2.5 3.86 4 5.5c1.36 1.49 2.5 3.11 2.5 5 0 3.59-2.91 6.5-6.5 6.5z"/></svg>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => updateWater(waterCount + 1)} className="flex-2 bg-white text-indigo-700 py-4 px-6 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Add Intake</button>
                    <button onClick={() => updateWater(0)} className="flex-1 bg-white/10 text-white py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">Reset</button>
                  </div>
               </div>
            </div>

            {/* Nutrition Link */}
            <button 
              onClick={() => setActiveTab('nutrition')}
              className="w-full bg-white rounded-[3rem] p-8 text-gray-900 shadow-xl shadow-emerald-100 border border-emerald-50 flex items-center justify-between group active:scale-98 transition-all"
            >
               <div className="flex items-center gap-5 text-left">
                  <div className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white group-hover:rotate-6 transition-transform shadow-lg shadow-emerald-200">
                     <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-tighter">Nutrition</h3>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest opacity-70">Curated Superfoods</p>
                  </div>
               </div>
               <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:translate-x-2 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
               </div>
            </button>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-5">
               <button 
                onClick={handleSaveResult}
                className={`py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-2xl ${isSaved ? 'bg-emerald-600 text-white shadow-emerald-100' : 'bg-gray-900 text-white shadow-gray-300 active:scale-95'}`}
              >
                {isSaved ? 'Logged ✓' : 'Save Log'}
              </button>
              <button 
                onClick={() => setShowShareCard(true)}
                className="py-6 bg-white border border-gray-100 text-gray-900 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] active:scale-95 shadow-lg shadow-gray-50 hover:bg-gray-50 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-10 animate-in slide-in-from-right duration-700 pt-8 pb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Superfoods</h2>
            <p className="text-sm text-gray-500 font-medium leading-relaxed px-1">Optimize your BMI target with high-density nutrition tailored for high-performance living.</p>
            
            <div className="space-y-8">
              <section className="bg-white p-8 rounded-[3rem] shadow-xl shadow-amber-100/50 border border-amber-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner">🌾</div>
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Prime Whole Grains</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {NUTRITION_GUIDE.wholeGrains.map(g => <span key={g} className="px-5 py-2.5 bg-amber-50/50 text-amber-800 text-xs font-black rounded-2xl border border-amber-100/50">{g}</span>)}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[3rem] shadow-xl shadow-rose-100/50 border border-rose-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner">🍎</div>
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Antioxidant Fruits</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {NUTRITION_GUIDE.fruits.map(f => <span key={f} className="px-5 py-2.5 bg-rose-50/50 text-rose-800 text-xs font-black rounded-2xl border border-rose-100/50">{f}</span>)}
                </div>
              </section>

              <section className="bg-white p-8 rounded-[3rem] shadow-xl shadow-emerald-100/50 border border-emerald-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">🥦</div>
                  <h3 className="font-black text-gray-900 uppercase tracking-widest text-[10px]">Essential Greens</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {NUTRITION_GUIDE.vegetables.map(v => <span key={v} className="px-5 py-2.5 bg-emerald-50/50 text-emerald-800 text-xs font-black rounded-2xl border border-emerald-100/50">{v}</span>)}
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-10 animate-in fade-in duration-700 pt-8 pb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Performance Logs</h2>
            <div className="bg-white border border-gray-100 p-8 rounded-[3.5rem] shadow-2xl shadow-gray-200/50">
               <HistoryChart data={history} />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3">Recent Benchmarks</h3>
              <div className="space-y-4">
                {history.length > 0 ? history.map(record => (
                  <div key={record.id} className="bg-white p-6 rounded-[2.5rem] flex justify-between items-center shadow-xl shadow-gray-100/50 border border-gray-50 group hover:-translate-y-1 transition-transform">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                        <span className="text-[8px] font-black uppercase text-gray-400 leading-none mb-1">{new Date(record.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                        <span className="text-lg font-black text-gray-900 leading-none">{new Date(record.date).getDate()}</span>
                      </div>
                      <div>
                        <div className="font-black text-2xl text-gray-900 tracking-tighter">{record.bmi} <small className="text-[8px] uppercase text-gray-400 tracking-widest">bmi</small></div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Weight: {profile.unitSystem === UnitSystem.METRIC ? `${record.weight}kg` : `${Math.round(record.weight * 2.20462)}lbs`}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="inline-block px-4 py-1.5 rounded-2xl text-white text-[9px] font-black uppercase tracking-widest shadow-md" style={{ backgroundColor: CATEGORY_COLORS[record.category] }}>{record.category}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-gray-400 text-sm font-black uppercase tracking-widest">Initialize your log</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="space-y-10 animate-in slide-in-from-left duration-700 pt-8 pb-16">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Member Identity</h2>
            <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Display Handle</label>
                <input 
                  type="text" required value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-gray-50 border-0 rounded-3xl p-5 font-black text-black text-lg focus:ring-4 focus:ring-indigo-100 shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Chronological Age</label>
                  <input 
                    type="number" 
                    value={profile.age} 
                    onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} 
                    className="w-full bg-gray-50 border-0 rounded-3xl p-5 font-black text-black text-lg focus:ring-4 focus:ring-indigo-100 shadow-inner" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Gender Selection</label>
                  <select 
                    value={profile.gender} 
                    onChange={e => setProfile({...profile, gender: e.target.value as any})} 
                    className="w-full bg-gray-50 border-0 rounded-3xl p-5 font-black text-black text-lg focus:ring-4 focus:ring-indigo-100 shadow-inner appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%234f46e5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5rem_1.5rem] bg-[right_1.25rem_center] bg-no-repeat"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 active:scale-95 transition-all hover:bg-indigo-700">Synchronize Cloud</button>
            </div>
            
            <button 
              onClick={() => { if(confirm('Erase all metadata and history?')) { clearAllData(); window.location.reload(); } }}
              className="w-full py-6 text-red-500 font-black text-[10px] uppercase tracking-[0.3em] hover:text-red-700 transition-colors"
            >
              Destroy All Data
            </button>
          </form>
        )}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-10 left-8 right-8 bg-black/90 backdrop-blur-3xl rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-50 shadow-2xl shadow-gray-900/20 border border-white/10 ring-8 ring-white/10">
        <button onClick={() => setActiveTab('calc')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'calc' ? 'scale-110 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-2.5 rounded-2xl ${activeTab === 'calc' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
          </div>
        </button>
        <button onClick={() => setActiveTab('nutrition')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'nutrition' ? 'scale-110 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-2.5 rounded-2xl ${activeTab === 'nutrition' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path></svg>
          </div>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'history' ? 'scale-110 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-2.5 rounded-2xl ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
          </div>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeTab === 'profile' ? 'scale-110 text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}>
          <div className={`p-2.5 rounded-2xl ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default App;
