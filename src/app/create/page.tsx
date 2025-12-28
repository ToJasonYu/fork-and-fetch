"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { X, ArrowLeft, Loader2, ImagePlus } from "lucide-react";
import Link from "next/link";

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("Dinner");
  const [cookingTime, setCookingTime] = useState("Under 30 mins");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        setImageBase64(base64Data);
        setMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageBase64(null);
    setMimeType(null);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      sessionStorage.setItem("recipeData", JSON.stringify({ ingredients, mealType, cookingTime, imageBase64, mimeType }));
      router.push("/recipe");
    } catch (err) {
      alert("Image too large!");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans selection:bg-orange-200">
       <nav className="p-6 md:px-12">
         <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm uppercase tracking-wider">
           <ArrowLeft size={18} /> Home
         </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="text-center mb-10 space-y-3">
           <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900">
             What's in your kitchen?
           </h1>
           <p className="text-lg text-slate-500 max-w-xl mx-auto">
             Snap a photo of your fridge or list your ingredients below.
           </p>
        </div>

        <form onSubmit={handleGenerate} className="bg-white p-2 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-white space-y-2">
          
          <div 
            {...getRootProps()}
            className={`relative rounded-[2rem] p-6 transition-all min-h-[200px] flex flex-col
                ${isDragActive ? "bg-orange-50 ring-2 ring-orange-500" : "bg-slate-50 hover:bg-slate-100/80"}
            `}
          >
            <input {...getInputProps()} />
            
            <textarea
              className="w-full bg-transparent outline-none resize-none font-medium text-xl text-slate-800 placeholder:text-slate-400 flex-grow"
              placeholder="e.g. I have some leftover pasta and tomatoes..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />

            {imageBase64 && (
              <div className="relative mt-4 h-40 w-full rounded-xl overflow-hidden group/img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`data:${mimeType};base64,${imageBase64}`} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={removeImage} className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex justify-between items-end mt-4 pt-4">
               <button type="button" onClick={open} className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                  <ImagePlus size={18} /> {imageBase64 ? "Change Photo" : "Add Photo"}
               </button>
            </div>
          </div>

          <div className="p-4 grid md:grid-cols-[1fr_1fr_1.5fr] gap-4 items-center">
            <select
              className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:border-orange-500 outline-none font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option>Dinner</option>
              <option>Lunch</option>
              <option>Breakfast</option>
              <option>Snack</option>
            </select>

            <select
              className="w-full p-4 bg-white rounded-2xl border border-slate-200 focus:border-orange-500 outline-none font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
            >
              <option>15 mins</option>
              <option>30 mins</option>
              <option>1 hour</option>
              <option>Slow Cook</option>
            </select>

            {/* BUTTON RESTORED: Orange, Visible Text, Nice Shadow */}
            <button
              type="submit"
              disabled={(!ingredients && !imageBase64) || isSubmitting}
              className="w-full h-full bg-orange-600 hover:bg-orange-700 text-white font-heading font-bold text-xl py-4 rounded-2xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Generate Recipe"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}