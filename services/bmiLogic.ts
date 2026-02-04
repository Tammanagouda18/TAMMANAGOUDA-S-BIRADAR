
import { BmiCategory, UnitSystem, WeightTarget } from '../types';
import { HEALTHY_BMI_TARGET } from '../constants';

export const calculateBmi = (weightKg: number, heightCm: number): number => {
  if (heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
};

export const getBmiCategory = (bmi: number): BmiCategory => {
  if (bmi < 18.5) return BmiCategory.UNDERWEIGHT;
  if (bmi < 25) return BmiCategory.NORMAL;
  if (bmi < 30) return BmiCategory.OVERWEIGHT;
  return BmiCategory.OBESE;
};

export const calculateTargetWeight = (heightCm: number, currentWeightKg: number): WeightTarget => {
  const heightM = heightCm / 100;
  const targetWeight = parseFloat((HEALTHY_BMI_TARGET * (heightM * heightM)).toFixed(1));
  const diff = parseFloat((currentWeightKg - targetWeight).toFixed(1));
  
  let action: 'lose' | 'gain' | 'maintain' = 'maintain';
  if (diff > 0.5) action = 'lose';
  else if (diff < -0.5) action = 'gain';

  return {
    targetWeight,
    difference: Math.abs(diff),
    action
  };
};

export const metricToImperial = (cm: number, kg: number) => {
  const inches = cm / 2.54;
  const ft = Math.floor(inches / 12);
  const inc = Math.round(inches % 12);
  const lbs = Math.round(kg * 2.20462);
  return { ft, inc, lbs };
};

export const imperialToMetric = (ft: number, inc: number, lbs: number) => {
  const cm = (ft * 12 + inc) * 2.54;
  const kg = lbs / 2.20462;
  return { cm, kg };
};
