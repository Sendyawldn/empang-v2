import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Ticket,
  User,
  Phone,
  CheckCircle,
  Send,
  AlertCircle,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingPage() {
  const [data, setData] = useState({
    settings: null as any,
    lombas: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    lomba_id: "",
    nama_peserta: "",
    no_wa: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Hasil Sukses
  const [bookingResult, setBookingResult] = useState<{
    kode: string;
    lomba: any;
  } | null>(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const res = await axios.get("/api/public/home");
      setData(res.data);
      // Otomatis pilih lomba pertama yang sisa slotnya > 0
      const availableLomba = res.data.lombas.find((l: any) => l.sisa > 0);
      if (availableLomba) {
        setFormData((prev) => ({
          ...prev,
          lomba_id: availableLomba.id.toString(),
        }));
      }
    } catch (err) {
      console.error("Gagal mengambil data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lomba_id) return alert("Pilih jadwal lomba dulu!");

    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/public/booking", formData);
      const bookedLomba = data.lombas.find(
        (l) => l.id.toString() === formData.lomba_id,
      );

      setBookingResult({
        kode: res.data.kode_booking,
        lomba: bookedLomba,
      });
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan pendaftaran. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi buat Generate Link WhatsApp
  const handleWhatsApp = () => {
    if (!data.settings || !bookingResult) return;

    // Format nomor WA agar valid untuk API wa.me (ubah 0 jadi 62 dan hapus karakter non-angka)
    let adminWA = data.settings.nomor_wa.replace(/\D/g, "");
    if (adminWA.startsWith("0")) {
      adminWA = "62" + adminWA.substring(1);
    }

    const text = `Halo Admin ${data.settings.nama_pemancingan}, saya mau konfirmasi pendaftaran lomba.\n\nNama: *${formData.nama_peserta}*\nJadwal: *${bookingResult.lomba.nama_lomba} (${bookingResult.lomba.tanggal_lomba})*\nKode Booking: *${bookingResult.kode}*\n\nMohon diverifikasi ya Bang.`;

    window.open(
      `https://wa.me/${adminWA}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <span className="font-bold text-slate-500 dark:text-slate-400 animate-pulse">
          Memuat data empang...
        </span>
      </div>
    );
  }

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-300 relative overflow-hidden">
      {/* Background Ornamen */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* HEADER PUBLIC */}
      <motion.div
        className="bg-slate-900 dark:bg-slate-950 text-white pt-8 pb-24 px-6 text-center relative border-b border-slate-800 transition-colors duration-300"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        {/* TOMBOL BACK KE HOME */}
        <Link
          to="/"
          className="absolute top-6 left-4 md:left-10 flex items-center gap-2 text-slate-400 hover:text-cyan-400 font-bold transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50"
        >
          <ArrowLeft size={20} />{" "}
          <span className="hidden md:inline">Kembali</span>
        </Link>

        {/* Tambahin margin-top (mt-8) biar judulnya gak nabrak tombol */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mt-8 md:mt-4">
          {data.settings?.nama_pemancingan || "Pemancingan"}
        </h1>
        <p className="text-slate-400 font-medium max-w-xl mx-auto">
          Segera amankan lapak Anda sebelum kehabisan! Sistem pendaftaran
          terintegrasi langsung dengan admin.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
        {/* JIKA SUKSES DAFTAR */}
        <AnimatePresence mode="wait">
          {bookingResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border-t-8 border-green-500 dark:border-green-400 border-x border-b border-slate-200 dark:border-slate-800 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner"
              >
                <CheckCircle
                  className="text-green-500 dark:text-green-400"
                  size={40}
                />
              </motion.div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 uppercase">
                Booking Berhasil!
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                Satu langkah lagi lapak resmi jadi milik Anda.
              </p>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-slate-50 dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mb-8 inline-block w-full max-w-sm shadow-md"
              >
                <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                  KODE BOOKING ANDA
                </p>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-wider">
                  {bookingResult.kode}
                </p>
              </motion.div>

              <div className="bg-yellow-50 dark:bg-amber-900/20 border border-yellow-200 dark:border-amber-500/30 p-4 rounded-xl text-yellow-800 dark:text-amber-400 text-sm font-bold flex items-start gap-3 text-left mb-8 shadow-sm">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p>
                  PENTING: Booking Anda otomatis hangus jika tidak menekan
                  tombol konfirmasi WhatsApp di bawah ini!
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="w-full md:w-auto bg-[#25D366] hover:bg-[#1ebe57] text-white px-8 py-4 rounded-2xl font-black flex justify-center items-center gap-3 transition-all shadow-lg hover:shadow-green-500/30 mx-auto"
              >
                <Send size={24} /> KONFIRMASI VIA WHATSAPP SEKARANG
              </motion.button>
            </motion.div>
          ) : (
            /* FORM & SLOT TRACKER */
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-2xl shadow-blue-500/5 dark:shadow-slate-950 border border-slate-100 dark:border-slate-800"
            >
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Ticket className="text-cyan-500" /> Formulir Pendaftaran
              </h2>

              {/* LIVE SLOT TRACKER */}
              <div className="mb-8 space-y-4">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">
                  Ketersediaan Sesi (Live)
                </label>
                <motion.div
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {data.lombas.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
                      <p className="font-bold text-slate-500 dark:text-slate-400">
                        Belum ada jadwal lomba yang tersedia.
                      </p>
                    </div>
                  ) : (
                    data.lombas.map((l: any) => {
                      const percent = (l.terisi / l.kuota) * 100;
                      const isFull = l.sisa === 0;
                      const isSelected = formData.lomba_id === l.id.toString();

                      return (
                        <motion.div
                          variants={listItemVariants}
                          key={l.id}
                          onClick={() =>
                            !isFull &&
                            setFormData({
                              ...formData,
                              lomba_id: l.id.toString(),
                            })
                          }
                          className={`relative overflow-hidden border-2 p-4 rounded-2xl transition-all cursor-pointer mb-3 ${
                            isFull
                              ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
                              : isSelected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10"
                                : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500 bg-white dark:bg-slate-800/50"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h3
                                className={`font-black ${isSelected ? "text-blue-700 dark:text-cyan-400" : "text-slate-800 dark:text-slate-200"}`}
                              >
                                {l.nama_lomba}
                              </h3>
                              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                <Clock size={12} /> {l.tanggal_lomba} • Rp{" "}
                                {(l.harga_tiket || 0).toLocaleString("id-ID")}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${isFull ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400" : "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"}`}
                              >
                                {isFull ? "PENUH" : `SISA ${l.sisa} LAPAK`}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${percent > 80 ? "bg-red-500" : "bg-cyan-500"} transition-all duration-1000`}
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </div>

              {/* FORM INPUT */}
              <AnimatePresence>
                {data.lombas.length > 0 &&
                  data.lombas.some((l) => l.sisa > 0) && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      onSubmit={handleSumbit}
                      className="space-y-6"
                    >
                      {formData.lomba_id && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-2 gap-4 pb-4"
                        >
                          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4 rounded-xl">
                            <label className="block text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase mb-1">
                              Biaya Pendaftaran
                            </label>
                            <div className="flex items-center gap-2 text-blue-700 dark:text-cyan-300 font-black text-lg">
                              Rp{" "}
                              {(
                                data.lombas.find(
                                  (l) => l.id.toString() === formData.lomba_id,
                                )?.harga_tiket || 0
                              ).toLocaleString("id-ID")}
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                              Peserta Terdaftar
                            </label>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-black text-lg">
                              {data.lombas.find(
                                (l) => l.id.toString() === formData.lomba_id,
                              )?.terisi || 0}{" "}
                              Orang
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                          Nama Panggilan / Komunitas
                        </label>
                        <div className="relative">
                          <User
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                          />
                          <input
                            type="text"
                            required
                            value={formData.nama_peserta}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                nama_peserta: e.target.value,
                              })
                            }
                            placeholder="Misal: Udin / Tim Joran Melengkung"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-cyan-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 outline-none font-bold text-slate-800 dark:text-white transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-widest">
                          Nomor WhatsApp Aktif
                        </label>
                        <div className="relative">
                          <Phone
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                          />
                          <input
                            type="text"
                            required
                            value={formData.no_wa}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              if (val.length <= 14) {
                                setFormData({ ...formData, no_wa: val });
                              }
                            }}
                            maxLength={14}
                            placeholder="Misal: 08123456789"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-cyan-500 dark:focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 outline-none font-bold text-slate-800 dark:text-white transition-all shadow-sm"
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || !formData.lomba_id}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-500 dark:disabled:from-slate-700 dark:disabled:to-slate-800 text-white py-4 rounded-2xl font-black text-lg uppercase tracking-wider shadow-lg shadow-blue-500/30 dark:shadow-cyan-500/20 transition-all flex justify-center items-center"
                      >
                        {isSubmitting
                          ? "Memproses..."
                          : "Booking Lapak Sekarang"}
                      </motion.button>
                    </motion.form>
                  )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
