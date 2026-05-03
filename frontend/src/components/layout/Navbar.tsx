import React, { useState, useEffect } from "react";
import { User, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/combro-fishing-logo.png"
            alt="Combro Fishing Logo"
            className="h-10 w-auto"
          />
          <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase transition-colors duration-300">
            COMBRO FISHING
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-bold text-[15px] text-slate-600 dark:text-slate-300">
          <Link
            to="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Beranda
          </Link>
          {/* <Link to="/status" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Cek Status
          </Link> */}
          <Link
            to="/jadwal"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Jadwal Lomba
          </Link>
          <a
            href="/#tentang-kami"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Tentang Kami
          </a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link
            to="/booking"
            className="hidden sm:inline-block bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-500/30"
          >
            Mulai Booking
          </Link>
        </div>
      </div>
    </nav>
  );
}
