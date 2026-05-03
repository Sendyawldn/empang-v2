<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lomba;
use App\Models\Booking;
use App\Models\Setting;
use Illuminate\Support\Carbon;

class PublicController extends Controller
{
    // 1. Mengambil Jadwal Lomba Aktif + Live Slot + Info Empang
    public function getHomeData()
{
    $todayJakarta = Carbon::now('Asia/Jakarta')->toDateString();

    return response()->json([
        'settings' => \App\Models\Setting::first(),
        'lombas' => \App\Models\Lomba::where('is_active', true)
            ->whereDate('tanggal_lomba', '>=', $todayJakarta)
            ->orderBy('tanggal_lomba')
            ->get()
            ->map(function ($l) {
                $terisi = $l->bookings()->whereIn('status', ['pending', 'verified'])->count();
                return [
                    'id' => $l->id,
                    'nama_lomba' => $l->nama_lomba,
                    'tanggal_lomba' => $l->tanggal_lomba,
                    'sisa' => max(0, $l->kuota - $terisi),
                    'terisi' => $terisi,
                    'kuota' => $l->kuota,
                    'harga_tiket' => $l->harga_tiket,
                    'total' => $l->kuota
                ];
            })
    ]);
}
    // 2. Menerima Pendaftaran dari Web (Masuk sebagai Pending)
    public function storeBooking(Request $request)
    {
        $request->validate([
            'lomba_id' => 'required|exists:lombas,id',
            'nama_peserta' => 'required|string',
            'no_wa' => 'required|string' // Sesuai dengan database awal lu
        ]);

        $booking = Booking::create([
            'lomba_id' => $request->lomba_id,
            'nama_peserta' => $request->nama_peserta,
            'no_wa' => $request->no_wa,
            'status' => 'pending'
        ]);

        // Bikin Kode Booking simpel (Misal: CMBR-007)
        $kode_booking = 'CMBR-' . str_pad($booking->id, 3, '0', STR_PAD_LEFT);

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil disimpan!',
            'kode_booking' => $kode_booking
        ]);
    }

    // 3. Mengambil Semua Jadwal + Pesertanya (Untuk Halaman Jadwal)
    public function getJadwalPeserta()
    {
        $todayJakarta = Carbon::now('Asia/Jakarta')->toDateString();

        $lombas = \App\Models\Lomba::with(['bookings', 'rekaps'])
            ->where('is_active', true)
            ->whereDate('tanggal_lomba', '>=', $todayJakarta)
            ->orderBy('tanggal_lomba', 'asc')
            ->get();

        $data = $lombas->map(function ($l) {
            $pesertaNames = [];
            
            // Masukkan dari rekap dulu
            foreach ($l->rekaps as $r) {
                $pesertaNames[] = $r->nama_peserta;
            }
            
            // Masukkan dari booking yang belum ada di rekap
            foreach ($l->bookings as $b) {
                if (in_array($b->status, ['pending', 'verified']) && !in_array($b->nama_peserta, $pesertaNames)) {
                    $pesertaNames[] = $b->nama_peserta;
                }
            }

            return [
                'id' => $l->id,
                'nama_lomba' => $l->nama_lomba,
                'tanggal_lomba' => $l->tanggal_lomba,
                'harga_tiket' => $l->harga_tiket,
                'kuota' => $l->kuota,
                'terisi' => count($pesertaNames),
                'peserta' => $pesertaNames
            ];
        });

        return response()->json($data);
    }
}
