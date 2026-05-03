import React, { useState } from "react";
import { Quote, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const reviews = [
  {
    name: "Pak Haji Mulyono",
    role: "Angler Senior",
    text: "Dulu harus bertanya dulu untuk liat lapak yang kosong, sekarang enakk bisa liat dari rumah lewat HP Mantap!",
    initial: "M"
  },
  // {
  //   name: "Andri Setiawan",
  //   role: "Juara Galatama 2025",
  //   text: "Sistem laporannya transparan banget. Kita bisa lihat siapa saja saingan kita di lomba nanti lewat web ini.",
  //   initial: "A"
  // },
];

const faqs = [
  {
    q: "Bagaimana cara membatalkan booking?",
    a: "Pembatalan dapat dilakukan maksimal H-1 lomba melalui fitur Cek Status atau hubungi WhatsApp Admin.",
  },
  // {
  //   q: "Apakah bisa bayar di tempat (COD)?",
  //   a: "Untuk mengamankan lapak, pembayaran wajib dilakukan via transfer bank atau E-Wallet dalam 1x24 jam.",
  // },
  {
    q: "Peralatan mancing disediakan?",
    a: "Kami menyediakan persewaan joran di lokasi (Kantin Combro).",
  },
];

export default function TestimonialsFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute -top-32 right-0 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 relative z-10">
        {/* Sisi Kiri: Testimoni */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-12 transition-colors">
            Kata Mereka 💬
          </h2>
          <div className="space-y-6">
            {reviews.map((rev, i) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                key={i}
                className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] relative border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all group"
              >
                <Quote
                  className="text-blue-100 dark:text-slate-700 absolute top-6 right-8 group-hover:text-blue-200 dark:group-hover:text-slate-600 transition-colors"
                  size={48}
                />
                <p className="text-lg text-slate-600 dark:text-slate-300 font-medium italic mb-6 transition-colors">
                  "{rev.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-sm">
                    {rev.initial}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 dark:text-white uppercase text-sm transition-colors">
                      {rev.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-widest transition-colors">
                      {rev.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sisi Kanan: FAQ */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-12 transition-colors">
            Pertanyaan Umum ❓
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full py-5 flex justify-between items-center text-left hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  <span className={`font-black text-lg uppercase tracking-tight transition-colors ${openIdx === i ? "text-blue-600 dark:text-cyan-400" : "text-slate-800 dark:text-slate-200"}`}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: openIdx === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={openIdx === i ? "text-blue-600 dark:text-cyan-400" : "text-slate-400"}
                  >
                    <ChevronDown />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-slate-500 dark:text-slate-400 font-medium leading-relaxed transition-colors">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
