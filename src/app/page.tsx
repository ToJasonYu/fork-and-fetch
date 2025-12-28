import Link from "next/link";
import { ArrowRight, ChefHat } from "lucide-react";

export default function Home() {
  return (
    // FIXED: Changed to 'bg-orange-50/75' (75% Opacity)
    <div className="min-h-screen bg-orange-50/75 font-sans selection:bg-orange-200 selection:text-orange-900 flex flex-col relative">
      
      {/* Nav */}
      <nav className="p-6 md:px-12 py-8 flex justify-between items-center">
         <div className="flex items-center gap-3 text-orange-600">
           <div className="p-2 bg-white rounded-lg shadow-sm border border-orange-100">
             <ChefHat size={28} strokeWidth={2.5} />
           </div>
           <span className="font-heading font-bold text-xl tracking-tight text-slate-900">Fork & Fetch</span>
         </div>
      </nav>

      <main className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-4xl space-y-10 animate-in slide-in-from-left duration-700">
          
          {/* Main Title */}
          <h1 className="text-7xl md:text-9xl font-heading font-extrabold text-slate-900 tracking-tight leading-[0.9]">
            Fork <br />
            <span className="text-orange-600">& Fetch.</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-lg leading-relaxed ml-1">
            Turn your random ingredients into something <span className="text-orange-600 font-bold">delicious</span>.
          </p>

          {/* Button */}
          <div className="pt-4 ml-1">
            <Link 
              href="/create"
              className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all transform hover:-translate-y-1 shadow-xl shadow-orange-500/20 group"
            >
              Let's get started
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </main>

      <div className="fixed bottom-6 left-6 md:left-12 lg:left-20 text-sm text-gray-500 font-medium z-50 pointer-events-none">
        Made by Jason Yu
      </div>

    </div>
  );
}