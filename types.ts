
export enum UnitSystem {
  METRIC = 'METRIC',
  IMPERIAL = 'IMPERIAL'
}

export enum BmiCategory {
  UNDERWEIGHT = 'Underweight',
  NORMAL = 'Normal',
  OVERWEIGHT = 'Overweight',
  OBESE = 'Obese'
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // Stored in cm
  weight: number; // Stored in kg
  unitSystem: UnitSystem;
}

export interface HistoryRecord {
  id: string;
  date: string;
  weight: number;
  bmi: number;
  category: BmiCategory;
}

export interface WeightTarget {
  targetWeight: number;
  difference: number;
  action: 'lose' | 'gain' | 'maintain';
}

export interface HealthTip {
  category: BmiCategory;
  tips: string[];
}
