import React, { useState } from 'react';
import { Share2, Minus, Plus, Clock, Flame } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [servings, setServings] = useState(2); 

  const handleShare = async () => {
    const text = `Check out this recipe for ${recipe.title} I found on Chef Whiskers!\n\n${recipe.description}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: recipe.title, text: text });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      navigator.clipboard.writeText(text);
      // Optional: Add a toast notification here
      alert('Recipe copied to clipboard!');
    }
  };

  const scaleAmount = (amount: number | undefined) => {
    if (!amount) return "";
    const scaled = (amount / 2) * servings; 
    return Number.isInteger(scaled) ? scaled : scaled.toFixed(1);
  };

  const difficultyColor = 
    recipe.difficulty === "Easy" ? "text-green-700 bg-green-100" :
    recipe.difficulty === "Medium" ? "text-orange-700 bg-orange-100" : 
    "text-red-700 bg-red-100";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full animate-fade-in-up">
      <div className="p-6 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-3 gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 leading-snug">{recipe.title}</h3>
          <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider whitespace-nowrap h-fit ${difficultyColor}`}>
            {recipe.difficulty || "Easy"}
          </span>
        </div>

        <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
          {recipe.description}
        </p>
        
        {/* Metadata Grid */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
           <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
               <div className="flex items-center text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                  <Clock size={14} className="mr-1.5" />
                  <span>{recipe.time}</span>
               </div>
               {recipe.calories && (
                 <div className="flex items-center text-rose-500 bg-rose-50 px-2 py-1 rounded-md">
                    <Flame size={14} className="mr-1.5" />
                    <span>{recipe.calories}</span>
                 </div>
               )}
           </div>

            {/* Servings Control */}
            <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200 px-1 py-0.5">
              <button onClick={() => setServings(Math.max(1, servings - 1))} className="p-1 hover:text-teal-600 text-slate-400 transition-colors"><Minus size={14} /></button>
              <span className="mx-2 text-xs font-bold text-slate-700 w-4 text-center">{servings}</span>
              <button onClick={() => setServings(servings + 1)} className="p-1 hover:text-teal-600 text-slate-400 transition-colors"><Plus size={14} /></button>
            </div>
        </div>

        {/* Ingredients Section */}
        <div className="mb-8 bg-slate-50/50 p-4 rounded-lg">
          <h4 className="flex items-center text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
            Ingredients
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} className="text-sm text-slate-700 flex items-start leading-snug justify-between border-b border-slate-100 border-dashed last:border-0 pb-1 last:pb-0">
                <span className="font-medium">{ing.item}</span>
                <span className="text-slate-500 font-semibold text-xs whitespace-nowrap ml-2">
                   {scaleAmount(ing.amount)} {ing.unit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div className="flex-1">
          <h4 className="flex items-center text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
            Instructions
          </h4>
          <div className="space-y-4">
            {recipe.steps.map((step, idx) => (
              <div key={idx} className="flex text-sm text-slate-600 group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center mr-3 mt-0.5 border border-teal-200">
                  {idx + 1}
                </span>
                <p className="leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleShare}
          className="flex items-center space-x-2 text-slate-500 hover:text-teal-600 text-xs font-bold uppercase tracking-wide transition-colors"
        >
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};