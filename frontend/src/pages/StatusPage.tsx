import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  Search,
  Ticket,
  Loader2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hash,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StatusPage() {
  const [searchName, setSearchName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchName.trim()) return;

    setIsLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const response = await axios.get(
        `/api/bookings/check/${searchName}`,
      );
      setResult(response.data.data);
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message || "Terjadi kesalahan pada server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300 relative overflow-hidden">
      {/* Background Ornamen */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Navbar />

      <main className="flex-grow py-20 px-6 flex flex-col items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden"
        >
          {/* Dekorasi Latar */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-cyan-400 rounded-3xl flex items-center justify-center mx-auto mb-8 relative z-10 shadow-sm border border-blue-100 dark:border-blue-500/20"
          >
            <Ticket size={40} strokeWidth={2.5} />
          </motion.div>

          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter relative z-10">
            Cek Status Booking
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 relative z-10">
            Masukkan Nama Lengkap atau Kode Booking yang Anda dapatkan saat mendaftar untuk melihat
            status verifikasi tiket Anda.
          </p>

          <form className="space-y-4 relative z-10" onSubmit={handleSearch}>
            <div className="relative">
              <Search
                className="absolute left-4 top-4 text-slate-400"
                size={20}
              />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Masukkan Nama atau Kode Booking..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-cyan-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all font-bold text-slate-800 dark:text-white"
                required
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2
                ${isLoading ? "bg-slate-400 dark:bg-slate-700 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-blue-500/30 dark:shadow-cyan-500/20"}`}
            >
              {isLoading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                "CARI DATA TIKET"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* --- AREA HASIL PENCARIAN --- */}
        <div className="max-w-xl w-full mt-8">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-start gap-4 shadow-sm"
              >
                <AlertCircle className="shrink-0 mt-0.5" size={24} />
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tight mb-1">
                    Pencarian Gagal
                  </h3>
                  <p className="font-medium text-sm">{errorMsg}</p>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden"
              >
                {/* Garis Dekorasi Tiket */}
                <div className={`absolute left-0 top-0 bottom-0 w-3 ${result.status === "verified" ? "bg-green-500" : "bg-yellow-500"}`}></div>

                {/* Kode Booking Display */}
                <div className="mb-6 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Hash className="text-blue-500 dark:text-cyan-400" size={20} />
                    <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Kode Booking
                    </span>
                  </div>
                  <span className="text-xl font-black text-blue-600 dark:text-cyan-400 tracking-wider">
                    {result.kode_booking}
                  </span>
                </div>

                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Tiket Atas Nama
                    </p>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {result.nama}
                    </h2>
                  </div>
                  {/* Badge Status Dinamis */}
                  <div
                    className={`px-4 py-2 rounded-xl font-black text-sm uppercase tracking-wide flex items-center gap-2 border
                    ${
                      result.status === "pending"
                        ? "bg-yellow-50 dark:bg-amber-900/20 text-yellow-600 dark:text-amber-400 border-yellow-200 dark:border-amber-500/30"
                        : "bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30"
                    }`}
                  >
                    {result.status === "pending" ? (
                      <Clock size={16} />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    {result.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Tanggal Lomba
                    </p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                      {result.tanggal}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                      Waktu Mendaftar
                    </p>
                    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                      {result.dibuat_pada}
                    </p>
                  </div>
                </div>

                {result.status === "pending" && (
                  <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-sm font-medium text-slate-500 dark:text-slate-400 text-center">
                    Segera selesaikan pembayaran dan konfirmasi ke WhatsApp Admin
                    agar status berubah menjadi <strong className="text-slate-700 dark:text-slate-200">Verified</strong>.
                  </div>
                )}
                {result.status === "verified" && (
                  <div className="mt-8 bg-green-50 dark:bg-green-500/10 p-4 rounded-2xl border border-green-100 dark:border-green-500/20 text-sm font-medium text-green-700 dark:text-green-400 text-center">
                    Selamat! Tiket Anda sudah berhasil di-ACC. Sampai jumpa di hari H!
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}
