import React, { useState, useRef } from 'react';
import { Camera, Upload, Leaf, Utensils, Zap, X, Loader2 } from 'lucide-react';
import { BlackCatLogo } from './components/Logo';
import { CameraCapture } from './components/CameraCapture';
import { RecipeCard } from './components/RecipeCard';
import { generateRecipes } from './services/gemini';
import { Recipe, InputMode } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<InputMode>('photo');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === 'photo' && !imagePreview) {
      setError("Please take a photo or upload an image first!");
      return;
    }
    if (activeTab === 'fridge' && !ingredientsInput.trim()) {
      setError("Please enter some ingredients!");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const input = activeTab === 'photo' ? imagePreview! : ingredientsInput;
      const result = await generateRecipes({ mode: activeTab, input, isVegetarian });
      setRecipes(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setImagePreview(null);
    setIngredientsInput('');
    setRecipes([]);
    setError(null);
    setCameraActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-20">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-teal-100/50 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
            <BlackCatLogo className="h-12 w-12" />
            <div className="border-l-2 border-teal-400 pl-3">
              <h1 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight leading-none">Chef Whiskers</h1>
              <p className="text-[10px] sm:text-xs text-teal-600 font-bold uppercase tracking-widest mt-0.5">Your Purr-sonal Sous Chef</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Ready to cook!</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Main Input Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden mb-12 max-w-3xl mx-auto border border-white relative z-10">
          
          {/* Mode Switcher */}
          <div className="flex p-2 bg-slate-50 gap-2">
            <button
              onClick={() => { setActiveTab('photo'); clearAll(); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex justify-center items-center space-x-2 transition-all duration-300 ${
                activeTab === 'photo' 
                  ? 'bg-white text-teal-600 shadow-md ring-1 ring-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              <Camera size={18} />
              <span>Snap Food</span>
            </button>
            <button
              onClick={() => { setActiveTab('fridge'); clearAll(); }}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex justify-center items-center space-x-2 transition-all duration-300 ${
                activeTab === 'fridge' 
                  ? 'bg-white text-teal-600 shadow-md ring-1 ring-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'
              }`}
            >
              <Utensils size={18} />
              <span>Pantry Mode</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Vegetarian Toggle */}
            <div className="flex justify-end mb-6">
               <button
                onClick={() => setIsVegetarian(!isVegetarian)}
                className={`group relative inline-flex items-center h-8 rounded-full transition-all duration-300 focus:outline-none ${
                    isVegetarian ? 'bg-teal-600 pr-9 pl-3 shadow-inner' : 'bg-slate-200 pr-3 pl-9'
                }`}
               >
                 <span className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-all duration-300 transform flex items-center justify-center text-teal-600 ${
                     isVegetarian ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
                 }`}>
                    {isVegetarian && <Leaf size={14} />}
                 </span>
                 <span className={`text-[10px] font-bold uppercase tracking-wider ${
                     isVegetarian ? 'text-white' : 'text-slate-500'
                 }`}>
                     Vegetarian
                 </span>
               </button>
            </div>

            {/* Photo Mode UI */}
            {activeTab === 'photo' && (
              <div className="space-y-4 animate-fade-in-up">
                {!imagePreview && !cameraActive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setCameraActive(true)}
                      className="h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 transition-all group"
                    >
                      <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                        <Camera size={28} className="text-teal-500" />
                      </div>
                      <span className="font-bold text-sm">Use Camera</span>
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-40 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/30 transition-all group"
                    >
                      <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                        <Upload size={28} className="text-teal-500" />
                      </div>
                      <span className="font-bold text-sm">Upload Photo</span>
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                    />
                  </div>
                )}

                {cameraActive && (
                  <CameraCapture 
                    onCapture={(data) => {
                      setImagePreview(data);
                      setCameraActive(false);
                    }}
                    onCancel={() => setCameraActive(false)}
                  />
                )}

                {imagePreview && (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-80 object-contain mx-auto" />
                    <button 
                      onClick={clearAll}
                      className="absolute top-3 right-3 bg-white text-slate-700 p-2 rounded-full shadow-lg hover:bg-slate-100 hover:text-rose-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Fridge Mode UI */}
            {activeTab === 'fridge' && (
              <div className="animate-fade-in-up">
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2"></span>
                    What's in your pantry?
                </label>
                <textarea
                  value={ingredientsInput}
                  onChange={(e) => setIngredientsInput(e.target.value)}
                  placeholder="e.g., 2 eggs, half an onion, some cheddar cheese, stale bread..."
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-100 focus:border-teal-400 focus:outline-none transition-all min-h-[140px] bg-slate-50 text-slate-700 placeholder:text-slate-400 resize-none font-medium"
                />
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button
                onClick={handleSubmit}
                disabled={loading || (activeTab === 'photo' && !imagePreview) || (activeTab === 'fridge' && !ingredientsInput)}
                className={`w-full py-4 rounded-xl font-black text-lg text-white shadow-xl shadow-teal-200/50 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:transform-none disabled:shadow-none ${
                  loading 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:shadow-teal-300/50'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>Asking Chef Whiskers...</span>
                  </>
                ) : (
                  <>
                    <Zap size={24} fill="currentColor" />
                    <span>Generate Recipes</span>
                  </>
                )}
              </button>
            </div>
            
            {error && (
              <div className="mt-6 p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold text-center border border-rose-100 animate-pulse flex items-center justify-center gap-2">
                <X size={16} /> {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {recipes.length > 0 && (
          <div className="animate-fade-in-up">
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center justify-center">
              <span className="bg-teal-100 p-2 rounded-xl mr-3 text-teal-700">
                <Utensils size={24} />
              </span>
              Here's what I cooked up!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, idx) => (
                <RecipeCard key={idx} recipe={recipe} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Welcome */}
        {recipes.length === 0 && !loading && !imagePreview && ingredientsInput === '' && (
          <div className="text-center py-12 opacity-60">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Awaiting Ingredients...</p>
          </div>
        )}
      </main>
    </div>
  );
}