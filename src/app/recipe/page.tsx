"use client";

import { useEffect, useState, useRef } from "react"; // 1. Added useRef
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Clock, Flame, Zap, ChefHat } from "lucide-react";
import Link from "next/link";

interface Recipe {
  title: string;
  description: string;
  difficulty: string;
  calories: string;
  ingredients: string[];
  instructions: string[];
  cookingTime?: string;
}

export default function RecipeResult() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  
  // 2. Create a ref to track if we've already fired the API
  const hasFetched = useRef(false);

  useEffect(() => {
    // 3. If we have already fetched (or started fetching), stop right here.
    if (hasFetched.current) return;
    hasFetched.current = true;

    const storedData = sessionStorage.getItem("recipeData");
    if (!storedData) {
      router.push("/create");
      return;
    }
    const { ingredients, mealType, cookingTime, imageBase64, mimeType } = JSON.parse(storedData);

    async function fetchRecipe() {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients, mealType, cookingTime, image: imageBase64, mimeType }),
        });
        if (!res.ok) throw new Error("Failed to generate");
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError("Oops! The chef is confused. Try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="space-y-6 animate-pulse">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 mx-auto w-fit text-orange-600">
             <ChefHat size={48} />
          </div>
          <h2 className="text-4xl font-heading font-extrabold text-slate-900">Cooking up magic...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-heading font-bold text-red-500 mb-4">Oh no!</h2>
        <p className="text-slate-600 mb-8">{error}</p>
        <Link href="/create" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-colors">
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 font-sans selection:bg-orange-200">
      <nav className="p-6 md:px-12 sticky top-0 z-10 bg-orange-50/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <Link href="/create" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm uppercase tracking-wider transition-colors">
            <ArrowLeft size={18} /> New Recipe
          </Link>
          <span className="font-heading font-bold text-xl text-slate-900">Fork & Fetch</span>
        </div>
      </nav>

      {recipe && (
        <main className="max-w-4xl mx-auto p-6 md:p-12 space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          
          <header className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-heading font-extrabold text-slate-900 leading-tight">
              {recipe.title}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto italic">
              "{recipe.description}"
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Badge icon={<Clock size={16} />} label={recipe.cookingTime || "30m"} color="orange" />
              <Badge icon={<Flame size={16} />} label={recipe.difficulty || "Medium"} color="cream" />
              <Badge icon={<Zap size={16} />} label={recipe.calories || "Healthy"} color="cream" />
            </div>
          </header>

          <div className="grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-16 items-start">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-orange-900/5 border border-white">
              <h3 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">1</span>
                Ingredients
              </h3>
              <ul className="space-y-4">
                {recipe.ingredients.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
               <h3 className="text-2xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-3 px-4">
                <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                Instructions
              </h3>
              <div className="space-y-10">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-5 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-white text-slate-300 rounded-xl flex items-center justify-center font-heading font-bold text-xl group-hover:text-orange-500 group-hover:shadow-md transition-all">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-lg leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

function Badge({ icon, label, color }: { icon: any, label: string, color: "orange" | "cream" }) {
  const styles = {
    orange: "bg-orange-500 text-white shadow-lg shadow-orange-500/30 border-transparent",
    cream: "bg-orange-100 text-slate-900 border-orange-200 shadow-sm",
  };
  return (
    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-bold text-sm transition-transform hover:-translate-y-0.5 ${styles[color]}`}>
      {icon} {label}
    </div>
  );
}