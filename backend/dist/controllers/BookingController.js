"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooking = exports.report = exports.verifyBooking = exports.getBookings = exports.checkStatus = exports.storeAdmin = exports.storeBooking = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const storeBooking = async (req, res) => {
    try {
        const { nama_peserta, tanggal_lomba } = req.body;
        if (!nama_peserta || !tanggal_lomba) {
            res.status(400).json({ error: 'Validation failed' });
            return;
        }
        const booking = await prisma_1.default.bookings.create({
            data: {
                nama_peserta,
                status: 'pending'
            }
        });
        res.json({
            success: true,
            message: 'Booking berhasil disimpan!'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.storeBooking = storeBooking;
const storeAdmin = async (req, res) => {
    try {
        const { lomba_id, nama_peserta, no_wa } = req.body;
        if (!lomba_id || !nama_peserta) {
            res.status(400).json({ error: 'Validation failed' });
            return;
        }
        const booking = await prisma_1.default.bookings.create({
            data: {
                lomba_id: Number(lomba_id),
                nama_peserta,
                no_wa: no_wa ?? '-',
                status: 'verified'
            }
        });
        res.json({
            success: true,
            message: 'Pendaftar offline berhasil ditambahkan!'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.storeAdmin = storeAdmin;
const checkStatus = async (req, res) => {
    try {
        const { nama } = req.params;
        let booking = null;
        if (String(nama).toUpperCase().startsWith('CMBR-')) {
            const id = parseInt(String(nama).toUpperCase().replace('CMBR-', ''), 10);
            booking = await prisma_1.default.bookings.findUnique({
                where: { id },
                include: { lombas: true }
            });
        }
        else {
            booking = await prisma_1.default.bookings.findFirst({
                where: {
                    nama_peserta: {
                        contains: String(nama)
                    }
                },
                orderBy: {
                    created_at: 'desc'
                },
                include: { lombas: true }
            });
        }
        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Data tidak ditemukan. Pastikan Nama atau Kode Booking sesuai.'
            });
            return;
        }
        res.json({
            success: true,
            data: {
                kode_booking: 'CMBR-' + String(booking.id).padStart(3, '0'),
                nama: booking.nama_peserta,
                tanggal: booking.lombas ? booking.lombas.tanggal_lomba : '-',
                status: booking.status,
                dibuat_pada: (0, moment_timezone_1.default)(booking.created_at).format('DD MMM YYYY HH:mm')
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.checkStatus = checkStatus;
const getBookings = async (req, res) => {
    try {
        const bookings = await prisma_1.default.bookings.findMany({
            orderBy: { created_at: 'desc' },
            include: { lombas: true }
        });
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getBookings = getBookings;
const verifyBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await prisma_1.default.bookings.findUnique({ where: { id: Number(id) } });
        if (!booking) {
            res.status(404).json({
                success: false,
                message: 'Data tiket tidak ditemukan.'
            });
            return;
        }
        await prisma_1.default.bookings.update({
            where: { id: Number(id) },
            data: { status: 'verified' }
        });
        res.json({
            success: true,
            message: 'Tiket atas nama ' + booking.nama_peserta + ' berhasil diverifikasi!'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.verifyBooking = verifyBooking;
const report = async (req, res) => {
    try {
        const hargaTiket = 100000;
        const totalPendaftar = await prisma_1.default.bookings.count();
        const pesertaLunas = await prisma_1.default.bookings.count({ where: { status: 'verified' } });
        const pesertaPending = await prisma_1.default.bookings.count({ where: { status: 'pending' } });
        const totalPendapatan = pesertaLunas * hargaTiket;
        const daftarLunas = await prisma_1.default.bookings.findMany({
            where: { status: 'verified' },
            orderBy: { created_at: 'desc' }
        });
        res.json({
            statistik: {
                total_pendaftar: totalPendaftar,
                lunas: pesertaLunas,
                pending: pesertaPending,
                pendapatan: totalPendapatan
            },
            peserta: daftarLunas
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.report = report;
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.bookings.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Peserta berhasil dihapus, slot kembali tersedia'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteBooking = deleteBooking;
