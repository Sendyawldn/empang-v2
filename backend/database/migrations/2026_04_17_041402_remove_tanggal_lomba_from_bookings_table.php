<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Cek kalau ada, buang kolomnya
            if (Schema::hasColumn('bookings', 'tanggal_lomba')) {
                $table->dropColumn('tanggal_lomba');
            }
            // Sekalian Bang, kalau lu dulunya punya kolom 'nama_lomba' atau 'harga_tiket' di tabel bookings, buang juga
            if (Schema::hasColumn('bookings', 'nama_lomba')) {
                $table->dropColumn('nama_lomba');
            }
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->date('tanggal_lomba')->nullable();
        });
    }
};