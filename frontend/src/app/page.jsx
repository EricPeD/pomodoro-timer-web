"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Revisar tema en localStorage al cargar
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
    setMounted(true);
  }, []);

  // Toggle tema
  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  if (!mounted) return null;

  return (
    <div
      className={`flex min-h-screen items-center justify-center font-sans transition-colors duration-700
        ${darkMode
          ? "bg-gradient-to-t from-purple-900 to-indigo-800"
          : "bg-gradient-to-b from-slate-50 to-slate-300"
        }`}
    >

            <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 flex items-center gap-2 rounded-full bg-slate-200 px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-32 px-16 sm:items-start relative">
      
       <div className=" mt-6 bg-red-300 h-36 px-4 py-2 w-full">
        {/* Container general */}


        <div>
          {/* Container logo */}
        </div>
        <div>
          {/* Container  selecion de tiempo y presets */}
          
            <div>
              {/* Container long time */}
            </div>

            <div>
              {/* Container short time */}
            </div>

            <div>
              {/* Container study time */}
            </div>
        </div>

        <div>
          
            {/* Container grid  */}
          
        </div>

        <div>
          {/* Container layout selector */}
        </div>


       </div>


      </main>
    </div>
  );
}
