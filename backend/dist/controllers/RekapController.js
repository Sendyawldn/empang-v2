"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRekap = exports.updateRekap = exports.storeRekap = exports.getByLomba = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getByLomba = async (req, res) => {
    try {
        const { lomba_id } = req.params;
        const rekaps = await prisma_1.default.rekaps.findMany({
            where: { lomba_id: Number(lomba_id) },
            orderBy: { created_at: 'desc' }
        });
        res.json(rekaps);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getByLomba = getByLomba;
const storeRekap = async (req, res) => {
    try {
        const { lomba_id, nama_peserta, no_wa, nominal_bayar, metode_bayar, status_bayar } = req.body;
        const lomba = await prisma_1.default.lombas.findUnique({ where: { id: Number(lomba_id) } });
        if (!lomba) {
            res.status(404).json({ message: 'Lomba not found' });
            return;
        }
        const harga_tiket = lomba.harga_tiket;
        const rekap = await prisma_1.default.rekaps.create({
            data: {
                lomba_id: Number(lomba_id),
                nama_peserta,
                no_wa: no_wa ?? '-',
                harga_tiket,
                nominal_bayar: nominal_bayar ? parseFloat(nominal_bayar) : harga_tiket,
                metode_bayar,
                status_bayar: status_bayar ?? 'lunas',
            }
        });
        res.json({
            success: true,
            message: 'Pembayaran berhasil dicatat!',
            data: rekap
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.storeRekap = storeRekap;
const updateRekap = async (req, res) => {
    try {
        const { id } = req.params;
        const { nominal_bayar, metode_bayar, status_bayar } = req.body;
        const rekap = await prisma_1.default.rekaps.findUnique({ where: { id: Number(id) } });
        if (!rekap) {
            res.status(404).json({ message: 'Data tidak ditemukan' });
            return;
        }
        const updated = await prisma_1.default.rekaps.update({
            where: { id: Number(id) },
            data: {
                nominal_bayar: nominal_bayar ? parseFloat(nominal_bayar) : rekap.nominal_bayar,
                metode_bayar: metode_bayar ?? rekap.metode_bayar,
                status_bayar: status_bayar ?? rekap.status_bayar,
            }
        });
        res.json({
            success: true,
            message: 'Data berhasil diperbarui!',
            data: updated
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateRekap = updateRekap;
const deleteRekap = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.rekaps.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true, message: 'Data berhasil dihapus' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ message: 'Data tidak ditemukan' });
            return;
        }
        res.status(500).json({ error: error.message });
    }
};
exports.deleteRekap = deleteRekap;
