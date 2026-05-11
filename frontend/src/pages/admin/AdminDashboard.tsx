import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  Search,
  Clock,
  CheckCircle,
  Trash2,
  UserPlus,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";

export default function AdminDashboard() {
  const [lombas, setLombas] = useState<any[]>([]);
  const [selectedLombaId, setSelectedLombaId] = useState<string>("");
  const [activeData, setActiveData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [offlineName, setOfflineName] = useState("");
  const [offlineWa, setOfflineWa] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");

  // 1. Ambil semua daftar lomba untuk dropdown
  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchLombas();
  }, []);

  // 2. Ambil detail pendaftar tiap kali dropdown lomba berubah
  useEffect(() => {
    if (selectedLombaId) {
      fetchLombaDetail(selectedLombaId);
    }
  }, [selectedLombaId]);

  const fetchLombas = async () => {
    try {
      const res = await axios.get("/api/admin/lombas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLombas(res.data);
      if (res.data.length > 0) {
        setSelectedLombaId(res.data[0].id.toString());
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Gagal load lomba", err);
    }
  };

  const fetchLombaDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/admin/lombas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveData(res.data);
    } catch (err) {
      console.error("Gagal load detail", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter pencarian nama
  const filteredBookings =
    activeData?.bookings?.filter((b: any) =>
      b.nama_peserta.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const stats = {
    // Total kuota lapak untuk sesi lomba yang sedang dipilih
    kuota_total: activeData?.kuota || 0,
    // Total orang yang sudah booking web (yang tidak dibatalkan)
    total_booking: activeData?.bookings?.length || 0,
  };

  // Kalkulasi Sisa Lapak
  const sisaLapak = stats.kuota_total - stats.total_booking;

  const handleDeleteBooking = async (bookingId: number, nama: string) => {
    const isConfirm = window.confirm(
      `Hapus pendaftar atas nama ${nama}? (Slot akan otomatis bertambah +1)`,
    );

    if (!isConfirm) return;

    try {
      await axios.delete(`/api/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh data agar statistik (Sisa Slot) di atas ikut update otomatis
      fetchLombaDetail(selectedLombaId);
      alert("Peserta berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus peserta.");
    }
  };

  const handleVerifyBooking = async (bookingId: number, nama: string) => {
    const isConfirm = window.confirm(
      `Verifikasi / ACC pendaftaran atas nama ${nama}?`,
    );

    if (!isConfirm) return;

    try {
      await axios.put(`/api/admin/bookings/${bookingId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh data
      fetchLombaDetail(selectedLombaId);
      alert("Peserta berhasil di-ACC!");
    } catch (err) {
      console.error(err);
      alert("Gagal memverifikasi peserta.");
    }
  };

  const handleAddOfflineBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offlineName.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(
        "/api/admin/bookings",
        {
          lomba_id: selectedLombaId,
          nama_peserta: offlineName,
          no_wa: offlineWa || "-",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh data
      setOfflineName("");
      setOfflineWa("");
      fetchLombaDetail(selectedLombaId);
      alert("Pendaftar offline berhasil ditambahkan!");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan pendaftar offline.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <main className="flex-grow p-8 bg-slate-50 min-h-screen">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Dashboard Monitor
          </h1>
          <p className="text-slate-500 font-medium">
            Pantau pendaftar dan statistik lomba aktif.
          </p>
        </header>

        {/* 1. PILIH SESI LOMBA */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
            Pilih Sesi Pantauan
          </label>
          <div className="relative max-w-md">
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ff4d4d]"
              size={20}
            />
            <select
              value={selectedLombaId}
              onChange={(e) => setSelectedLombaId(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-100 appearance-none cursor-pointer"
            >
              {lombas.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.tanggal_lomba} — {l.nama_lomba}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeData && (
          <>
            {/* 2. KARTU STATISTIK SESI INI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* KARTU 1: TOTAL BOOKING */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-6">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Users size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Total Antrean / Booking
                  </p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {stats.total_booking} Orang
                  </h3>
                </div>
              </div>

              {/* KARTU 2: TOTAL KUOTA */}
              <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-6">
                <div className="w-14 h-14 bg-slate-50 text-slate-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Kapasitas slot pendaftaran
                  </p>
                  <h3 className="text-2xl font-black text-slate-900">
                    {stats.kuota_total} pendaftaran
                  </h3>
                </div>
              </div>

              {/* KARTU 3: SISA LAPAK (WARNA MENYESUAIKAN) */}
              <div
                className={`p-8 rounded-[32px] shadow-sm border flex items-center gap-6 ${
                  sisaLapak <= 5
                    ? "bg-red-500 text-white border-red-600"
                    : "bg-green-500 text-white border-green-600"
                }`}
              >
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Clock size={28} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">
                    Sisa pendaftaran Tersedia
                  </p>
                  <h3 className="text-3xl font-black">
                    {sisaLapak > 0 ? sisaLapak : 0} pendaftar
                  </h3>
                </div>
              </div>
            </div>

            {/* FORM TAMBAH OFFLINE */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm mb-8">
              <h2 className="font-black text-slate-800 uppercase tracking-tight flex items-center gap-2 mb-4">
                <UserPlus size={20} className="text-[#ff4d4d]" /> Tambah Pendaftar Offline
              </h2>
              <form onSubmit={handleAddOfflineBooking} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nama Peserta"
                  value={offlineName}
                  onChange={(e) => setOfflineName(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-100"
                />
                <input
                  type="text"
                  placeholder="No HP (Opsional)"
                  value={offlineWa}
                  onChange={(e) => setOfflineWa(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-100"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || sisaLapak <= 0}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? "Menyimpan..." : "Tambah Data"}
                </button>
              </form>
            </div>

            {/* 3. TABEL DATA PENDAFTAR WEB */}
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="font-black text-slate-800 uppercase tracking-tight">
                  Daftar Peserta Masuk (Web)
                </h2>
                <div className="relative w-full md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Cari nama..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-[#ff4d4d]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Kode Booking
                      </th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Nama Peserta
                      </th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        No. HP (WA)
                      </th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        Status & Aksi
                      </th>
                      <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Waktu Daftar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-10 text-center font-bold text-slate-400"
                        >
                          Belum ada data antrean.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b: any) => (
                        <tr
                          key={b.id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="p-4 font-bold text-blue-600">
                            CMBR-{b.id.toString().padStart(3, "0")}
                          </td>
                          <td className="p-4 font-bold text-slate-800">
                            {b.nama_peserta}
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {b.no_wa ? b.no_wa : "-"}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {b.status === "pending" ? (
                                <button
                                  onClick={() => handleVerifyBooking(b.id, b.nama_peserta)}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg hover:bg-yellow-200 transition-colors flex items-center gap-1"
                                  title="ACC Pendaftaran"
                                >
                                  <Clock size={14} />
                                  ACC
                                </button>
                              ) : (
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg flex items-center gap-1">
                                  <CheckCircle size={14} />
                                  Verified
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  handleDeleteBooking(b.id, b.nama_peserta)
                                }
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Hapus Peserta"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right text-xs text-slate-400 font-bold">
                            {new Date(b.created_at).toLocaleString("id-ID")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </AdminLayout>
  );
}
