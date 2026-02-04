
import { BmiCategory, HealthTip } from './types';

export const HEALTHY_BMI_TARGET = 22.0;
export const DAILY_WATER_GOAL = 8; // glasses

export const CATEGORY_COLORS = {
  [BmiCategory.UNDERWEIGHT]: '#3b82f6', // Blue
  [BmiCategory.NORMAL]: '#22c55e',      // Green
  [BmiCategory.OVERWEIGHT]: '#f59e0b',  // Orange/Yellow
  [BmiCategory.OBESE]: '#ef4444',       // Red
};

export const NUTRITION_GUIDE = {
  wholeGrains: ["Quinoa", "Oats", "Brown Rice", "Buckwheat", "Whole Wheat Pasta", "Barley"],
  fruits: ["Blueberries", "Avocado", "Oranges", "Apples", "Bananas", "Pomegranates"],
  vegetables: ["Spinach", "Kale", "Broccoli", "Sweet Potatoes", "Bell Peppers", "Brussels Sprouts"]
};

export const HEALTH_TIPS: HealthTip[] = [
  {
    category: BmiCategory.UNDERWEIGHT,
    tips: [
      "Include healthy fats like avocados, nuts, and olive oil in your diet.",
      "Focus on strength training to build muscle mass safely.",
      "Eat smaller, frequent meals throughout the day to increase calorie intake."
    ]
  },
  {
    category: BmiCategory.NORMAL,
    tips: [
      "Maintain a balanced diet rich in whole grains, fruits, and vegetables.",
      "Aim for at least 150 minutes of moderate aerobic activity weekly.",
      "Stay hydrated and monitor your sleep quality for overall wellness."
    ]
  },
  {
    category: BmiCategory.OVERWEIGHT,
    tips: [
      "Try replacing sugary drinks with water or herbal teas.",
      "Incorporate more fiber into your meals to feel fuller for longer.",
      "Start with low-impact exercises like walking or swimming."
    ]
  },
  {
    category: BmiCategory.OBESE,
    tips: [
      "Consult with a healthcare professional before starting a new intense workout.",
      "Practice portion control and mindful eating habits.",
      "Focus on consistent, sustainable lifestyle changes rather than quick fixes."
    ]
  }
];
