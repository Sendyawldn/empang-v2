import React from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">

      {/* KIRI: TEKS INFORMASI */}
      <motion.div
        className="flex-1 space-y-8 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-sm font-black border border-blue-100 dark:border-blue-500/20 uppercase tracking-widest shadow-sm">
          Info Lomba Terbaru 🏆
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter uppercase transition-colors duration-300">
          Mancing Nyaman, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 dark:from-cyan-400 dark:to-blue-500">Hasil Maksimal</span>
        </motion.h1>

        <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300 transition-colors duration-300">
          Amankan Lapak Anda Sekarang!
        </motion.h2>

        <motion.p variants={itemVariants} className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl transition-colors duration-300">
          Sistem informasi pemancingan modern untuk Combro Fishing. Kelola
          pendaftaran, pilih lapak strategis, dan persiapkan mental juara Anda hari ini juga.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-4">
          <a
            href="/booking"
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg hover:scale-105 transition-all flex items-center gap-3 shadow-xl shadow-blue-500/20 dark:shadow-blue-900/40 w-full sm:w-auto justify-center"
          >
            BOOKING SEKARANG
            <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="/jadwal">
            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg hover:opacity-90 transition-all shadow-lg w-full sm:w-auto">
              LIHAT JADWAL
            </button>
          </a>
        </motion.div>
      </motion.div>

      {/* KANAN: 3D SPLIT / FLOATING CARD PERSPECTIVE */}
      <motion.div
        className="flex-1 w-full lg:w-auto relative perspective-1000 z-10 mt-10 lg:mt-0"
        initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
      >
        <motion.div style={{ y: y1 }} className="relative z-20">
          <motion.div
            whileHover={{ scale: 1.02, rotateX: 5, rotateY: -5 }}
            className="relative rounded-[2rem] overflow-hidden border-[8px] sm:border-[12px] border-white dark:border-slate-800 shadow-2xl transition-all duration-500 aspect-[4/5] bg-slate-200 dark:bg-slate-700 w-full lg:max-w-[450px] ml-auto origin-center"
          >
            <img
              src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Fisherman"
              className="w-full h-full object-cover"
            />

            {/* Overlay Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

            {/* Badge Bawah */}
            {/* <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 bg-white/20 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/30 dark:border-white/10 shadow-lg transform translate-y-2 hover:translate-y-0 transition-transform">
              <p className="text-white font-black text-xl mb-1 drop-shadow-md">
              </p>
              <p className="text-white/80 font-bold uppercase text-[10px] sm:text-xs tracking-widest drop-shadow-sm">
              </p>
            </div> */}
          </motion.div>
        </motion.div>

        {/* Gambar Ornamen Tumpuk di Belakang (3D Effect) */}
        {/* <motion.div 
          style={{ y: y2 }}
          className="absolute -top-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 rounded-[2rem] overflow-hidden border-[6px] border-white dark:border-slate-800 shadow-xl z-0 opacity-70 hidden sm:block"
        >
           <img
              src="https://images.unsplash.com/photo-1559265219-4a00063af980?auto=format&fit=crop&w=500&q=80"
              alt="Fishing Details"
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-black/30 mix-blend-overlay"></div>
        </motion.div> */}
      </motion.div>

      {/* Decorative Blob */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-[120px] -z-10 pointer-events-none opacity-50"></div>
    </section>
  );
}
