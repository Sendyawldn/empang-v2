import React from "react";
import { Anchor, Users, Award, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: <Anchor className="text-white" size={28} />,
    value: "34",
    label: "Lapak",
    gradient: "from-blue-500 to-blue-600"
  },

  {
    icon: <Award className="text-white" size={28} />,
    value: "100+",
    label: "Lomba Sukses",
    gradient: "from-blue-400 to-blue-500"
  },
  {
    icon: <ShieldCheck className="text-white" size={28} />,
    value: "24/7",
    label: "Sistem Aktif",
    gradient: "from-cyan-500 to-blue-500"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }
};

export default function AboutSection() {
  return (
    <section
      id="tentang-kami"
      className="py-24 px-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300 relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* Kiri: Teks Tentang Kami */}
        <motion.div
          className="flex-1 space-y-8"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-full text-sm font-black border border-slate-200 dark:border-slate-700 uppercase tracking-widest shadow-sm">
            Tentang Kami 🎣
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[1.1] transition-colors">
            Lebih Dari Sekadar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Kolam Pancing</span>
          </h2>

          <div className="space-y-4 text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl transition-colors">
            <p>
              Combro Fishing hadir untuk mendobrak tradisi lama. Kami memadukan
              fasilitas kolam pemancingan kelas satu dengan teknologi reservasi
              digital yang modern dan transparan.
            </p>
            <p>
              Visi kami sederhana: Memberikan kenyamanan maksimal bagi para
              *angler*. Dari saat Anda memilih lapak di rumah, hingga momen Anda
              juara di kolam kami.
            </p>
          </div>
        </motion.div>

        {/* Kanan: Grid Statistik */}
        <motion.div
          className="flex-1 w-full grid grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, idx) => (
            <motion.div
              variants={statVariants}
              key={idx}
              className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${stat.gradient} w-14 h-14 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter transition-colors">
                {stat.value}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-widest transition-colors">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
