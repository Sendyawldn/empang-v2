<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        // Ambil data pertama, kalau nggak ada buat baru yang kosong
        return response()->json(Setting::firstOrCreate([], [
            'nama_pemancingan' => 'Nama Empang Lu',
            'nomor_wa' => '08123456789',
            'lokasi' => 'Alamat Empang',
            'info_rekening' => 'Bank Mandiri 123456789 a/n Nama Lu'
        ]));
    }

    public function update(Request $request)
    {
        try {
            $request->validate([
                'nama_pemancingan' => 'required|string',
                'nomor_wa' => 'required|string',
                'lokasi' => 'required|string',
                'info_rekening' => 'required|string',
            ]);

            $setting = Setting::first();
            $data = $request->only(['nama_pemancingan', 'nomor_wa', 'lokasi', 'info_rekening', 'peraturan_empang']);
            $setting->update($data);

            return response()->json(['message' => 'Pengaturan berhasil disimpan!', 'data' => $setting]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()], 500);
        }
    }

    public function uploadGallery(Request $request)
    {
        try {
            $request->validate([
                'potret_kami_files.*' => 'image|mimes:jpeg,png,jpg,gif|max:5000'
            ]);

            $setting = Setting::first();
            
            // Pastikan data yang ada bentuknya array
            $currentImages = $setting->potret_kami;
            if (is_string($currentImages)) {
                $currentImages = json_decode($currentImages, true);
            }
            $existingImages = is_array($currentImages) ? $currentImages : [];

            if ($request->hasFile('potret_kami_files')) {
                $files = $request->file('potret_kami_files');
                // Kadang dari frontend bukan array kalau cuma 1 file, kita pastikan array
                if (!is_array($files)) {
                    $files = [$files];
                }

                foreach ($files as $file) {
                    $path = $file->store('potret', 'public');
                    $existingImages[] = '/storage/' . $path;
                }
                
                // Hapus duplikat kalau ada
                $existingImages = array_values(array_unique($existingImages));
                
                $setting->potret_kami = $existingImages;
                $setting->save();
            }

            return response()->json(['message' => 'Foto berhasil diunggah!', 'data' => $setting]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deleteGalleryItem(Request $request)
    {
        try {
            $request->validate([
                'image_url' => 'required|string'
            ]);

            $setting = Setting::first();
            
            $currentImages = $setting->potret_kami;
            if (is_string($currentImages)) {
                $currentImages = json_decode($currentImages, true);
            }
            $existingImages = is_array($currentImages) ? $currentImages : [];
            
            $newImages = array_values(array_filter($existingImages, function($img) use ($request) {
                return $img !== $request->image_url;
            }));

            $setting->potret_kami = $newImages;
            $setting->save();
            
            return response()->json(['message' => 'Foto berhasil dihapus!', 'data' => $setting]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
