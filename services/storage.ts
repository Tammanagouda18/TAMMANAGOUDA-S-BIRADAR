
import { UserProfile, HistoryRecord, UnitSystem } from '../types';

const PROFILE_KEY = 'vitals_profile';
const HISTORY_KEY = 'vitals_history';

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveHistoryRecord = (record: HistoryRecord): void => {
  const history = getHistory();
  const updated = [record, ...history].slice(0, 50); // Keep last 50
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const getHistory = (): HistoryRecord[] => {
  const data = localStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearAllData = (): void => {
  localStorage.removeItem(PROFILE_KEY);
  localStorage.removeItem(HISTORY_KEY);
};

export const getDefaultProfile = (): UserProfile => ({
  name: '',
  age: 30,
  gender: 'male',
  height: 170,
  weight: 70,
  unitSystem: UnitSystem.METRIC
});
