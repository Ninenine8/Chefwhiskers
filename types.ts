export interface Ingredient {
  item: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  calories: string;
  time: string;
  ingredients: Ingredient[];
  steps: string[];
}

export type InputMode = 'photo' | 'fridge';

export interface GenerationRequest {
  mode: InputMode;
  input: string; // Base64 image string or text ingredients
  isVegetarian: boolean;
}