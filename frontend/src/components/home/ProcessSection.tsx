import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "PILIH JADWAL",
    desc: "Pantau kalender lomba kami dan pilih tanggal yang pas untuk beraksi.",
  },
  {
    number: "02",
    title: "AMANKAN LAPAK",
    desc: "Pilih nomor lapak favoritmu dari denah digital kami sebelum didului orang lain.",
  },
  {
    number: "03",
    title: "BAYAR & MANCING",
    desc: "Datang Bayar dan Nikmatin keseruannya!",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const stepVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
};

export default function ProcessSection() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900 px-6 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter transition-colors">
            Hanya 3 Langkah Mudah
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium transition-colors">
            Tinggalkan cara lama. Booking lapak kini semudah memesan tiket bioskop.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step, i) => (
            <motion.div variants={stepVariants} key={i} className="relative group">
              {/* Angka Besar di Belakang */}
              <div className="text-8xl md:text-9xl font-black text-slate-50 dark:text-slate-800/50 absolute -top-12 -left-6 z-0 group-hover:text-blue-50 dark:group-hover:text-slate-800 transition-colors duration-500">
                {step.number}
              </div>

              {/* Konten Teks */}
              <div className="relative z-10 pt-4">
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mb-6 rounded-full group-hover:w-20 transition-all duration-300"></div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium transition-colors">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
