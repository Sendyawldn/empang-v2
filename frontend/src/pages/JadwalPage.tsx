import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Users, Trophy, AlertCircle } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { motion } from "framer-motion";

// 1. Tambahkan Interface biar TypeScript-nya rapi (gak pakai any)
interface Lomba {
  id: string | number;
  nama_lomba: string;
  tanggal_lomba: string;
  terisi: number;
  kuota: number;
  harga_tiket: number;
  peserta: string[];
}

export default function JadwalPage() {
  const [lombas, setLombas] = useState<Lomba[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State untuk error handling

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get("/api/public/jadwal-peserta");
      setLombas(res.data);
    } catch (err) {
      console.error("Gagal mengambil data jadwal:", err);
      setError("Gagal memuat jadwal lomba. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors flex flex-col">
      <Navbar />

      {/* 2. Padding top dikurangi jadi pt-24 biar gak terlalu ke bawah, gak perlu pakai -mt-8 lagi */}
      <main className="flex-grow pt-24 pb-20 px-4 max-w-7xl mx-auto w-full">

        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-blue-50 dark:bg-cyan-900/30 px-4 py-2 rounded-full mb-4"
          >
            <span className="text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm flex items-center gap-2">
              <Calendar size={16} /> Jadwal & Peserta
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4"
          >
            Daftar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Angler</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium"
          >
            Lihat jadwal lomba terdekat dan daftar peserta yang sudah terdaftar. Siapkan joranmu!
          </motion.p>
        </div>

        {/* Content Section: Loading, Error, Empty, or Data */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-cyan-400"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-800/30">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
            <p className="text-red-600 dark:text-red-400 font-bold">{error}</p>
            <button
              onClick={fetchJadwal}
              className="mt-4 px-6 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-full font-bold text-sm hover:bg-red-200 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        ) : lombas.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
            <Trophy className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={64} />
            <p className="text-slate-500 dark:text-slate-400 font-bold text-lg">Belum ada jadwal lomba saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lombas.map((lomba, index) => (
              <motion.div
                key={lomba.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all flex flex-col"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight">
                      {lomba.nama_lomba}
                    </h3>
                    <div className="bg-blue-100 dark:bg-cyan-900/50 text-blue-700 dark:text-cyan-400 text-xs font-black px-3 py-1.5 rounded-full whitespace-nowrap shrink-0">
                      {lomba.tanggal_lomba}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-blue-500" />
                      <span>{lomba.terisi} / {lomba.kuota} Lapak</span>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                        Rp {lomba.harga_tiket.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body (Peserta List) */}
                <div className="px-6 pb-6 pt-0 h-72 overflow-y-auto custom-scrollbar relative bg-white dark:bg-slate-800">
                  {/* 3. Perbaikan Sticky Header dengan Backdrop Blur biar teks nggak nabrak pas di-scroll */}
                  <div className="sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md z-10 pt-6 pb-3 mb-3 border-b border-slate-100 dark:border-slate-700/50">
                    <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      Daftar Peserta
                    </h4>
                  </div>

                  {lomba.peserta.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 opacity-50">
                      <p className="text-slate-400 dark:text-slate-500 text-sm italic font-medium">
                        Lapak masih kosong.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-2.5">
                      {lomba.peserta.map((nama, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-cyan-900/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm group-hover:scale-105 transition-transform">
                            {idx + 1}
                          </div>
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                            {nama}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}