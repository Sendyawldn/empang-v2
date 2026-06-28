"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLomba = exports.getLomba = exports.createLomba = exports.getLombas = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getLombas = async (req, res) => {
    try {
        const lombas = await prisma_1.default.lombas.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(lombas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLombas = getLombas;
const createLomba = async (req, res) => {
    try {
        const { nama_lomba, tanggal_lomba, harga_tiket } = req.body;
        if (!nama_lomba || !tanggal_lomba || !harga_tiket) {
            res.status(400).json({ error: 'Validation failed' });
            return;
        }
        const lomba = await prisma_1.default.lombas.create({
            data: {
                nama_lomba,
                tanggal_lomba: new Date(tanggal_lomba),
                harga_tiket: parseFloat(harga_tiket),
                kuota: 34,
                is_active: true
            }
        });
        res.json({
            success: true,
            message: 'Jadwal Lomba berhasil dibuat!',
            data: lomba
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createLomba = createLomba;
const getLomba = async (req, res) => {
    try {
        const { id } = req.params;
        const lomba = await prisma_1.default.lombas.findUnique({
            where: { id: Number(id) },
            include: {
                rekaps: true,
                bookings: true
            }
        });
        if (!lomba) {
            res.status(404).json({ error: 'Lomba not found' });
            return;
        }
        res.json(lomba);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLomba = getLomba;
const deleteLomba = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.lombas.delete({
            where: { id: Number(id) }
        });
        res.json({
            success: true,
            message: 'Jadwal Lomba berhasil dihapus!'
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteLomba = deleteLomba;
