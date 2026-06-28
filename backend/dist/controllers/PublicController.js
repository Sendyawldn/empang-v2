"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJadwalPeserta = exports.storeBooking = exports.getHomeData = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getHomeData = async (req, res) => {
    try {
        const todayJakarta = (0, moment_timezone_1.default)().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const settings = await prisma_1.default.settings.findFirst();
        // In Prisma, we query lombas and include bookings to compute counts
        const lombas = await prisma_1.default.lombas.findMany({
            where: {
                is_active: true,
                tanggal_lomba: {
                    gte: new Date(todayJakarta)
                }
            },
            orderBy: {
                tanggal_lomba: 'asc'
            },
            include: {
                bookings: {
                    where: {
                        status: { in: ['pending', 'verified'] }
                    }
                }
            }
        });
        const formattedLombas = lombas.map((l) => {
            const terisi = l.bookings.length;
            return {
                id: l.id,
                nama_lomba: l.nama_lomba,
                tanggal_lomba: l.tanggal_lomba,
                sisa: Math.max(0, l.kuota - terisi),
                terisi: terisi,
                kuota: l.kuota,
                harga_tiket: l.harga_tiket,
                total: l.kuota
            };
        });
        res.json({
            settings,
            lombas: formattedLombas
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getHomeData = getHomeData;
const storeBooking = async (req, res) => {
    try {
        const { lomba_id, nama_peserta, no_wa } = req.body;
        if (!lomba_id || !nama_peserta || !no_wa) {
            res.status(400).json({ error: 'Validation failed' });
            return;
        }
        const booking = await prisma_1.default.bookings.create({
            data: {
                lomba_id: Number(lomba_id),
                nama_peserta,
                no_wa,
                status: 'pending'
            }
        });
        const kode_booking = 'CMBR-' + String(booking.id).padStart(3, '0');
        res.json({
            success: true,
            message: 'Booking berhasil disimpan!',
            kode_booking
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.storeBooking = storeBooking;
const getJadwalPeserta = async (req, res) => {
    try {
        const todayJakarta = (0, moment_timezone_1.default)().tz('Asia/Jakarta').format('YYYY-MM-DD');
        const lombas = await prisma_1.default.lombas.findMany({
            where: {
                is_active: true,
                tanggal_lomba: {
                    gte: new Date(todayJakarta)
                }
            },
            orderBy: {
                tanggal_lomba: 'asc'
            },
            include: {
                rekaps: true,
                bookings: true
            }
        });
        const data = lombas.map((l) => {
            const pesertaNames = [];
            l.rekaps.forEach((r) => {
                if (r.nama_peserta) {
                    pesertaNames.push(r.nama_peserta);
                }
            });
            l.bookings.forEach((b) => {
                if (b.nama_peserta &&
                    ['pending', 'verified'].includes(b.status || '') &&
                    !pesertaNames.includes(b.nama_peserta)) {
                    pesertaNames.push(b.nama_peserta);
                }
            });
            return {
                id: l.id,
                nama_lomba: l.nama_lomba,
                tanggal_lomba: l.tanggal_lomba,
                harga_tiket: l.harga_tiket,
                kuota: l.kuota,
                terisi: pesertaNames.length,
                peserta: pesertaNames
            };
        });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getJadwalPeserta = getJadwalPeserta;
