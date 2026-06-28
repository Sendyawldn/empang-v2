"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const getReports = async (req, res) => {
    try {
        const { start_date, end_date, metode_bayar } = req.query;
        let whereClause = {};
        if (start_date && end_date) {
            whereClause.created_at = {
                gte: new Date(start_date),
                lte: new Date(end_date)
            };
        }
        if (metode_bayar && metode_bayar !== 'semua') {
            whereClause.metode_bayar = metode_bayar;
        }
        const rekaps = await prisma_1.default.rekaps.findMany({
            where: whereClause
        });
        const totalPeserta = rekaps.length;
        let totalRevenue = 0;
        let totalCash = 0;
        let totalTF = 0;
        rekaps.forEach((r) => {
            const nominal = Number(r.nominal_bayar) || 0;
            totalRevenue += nominal;
            if (r.metode_bayar === 'tunai') {
                totalCash += nominal;
            }
            else if (r.metode_bayar === 'transfer') {
                totalTF += nominal;
            }
        });
        const persenCash = totalRevenue > 0 ? Math.round((totalCash / totalRevenue) * 1000) / 10 : 0;
        const persenTransfer = totalRevenue > 0 ? Math.round((totalTF / totalRevenue) * 1000) / 10 : 0;
        // Daily grouping
        const dailyMap = {};
        const monthlyMap = {};
        rekaps.forEach((r) => {
            const nominal = Number(r.nominal_bayar) || 0;
            const dateStr = (0, moment_timezone_1.default)(r.created_at).tz('Asia/Jakarta').format('YYYY-MM-DD');
            const monthStr = (0, moment_timezone_1.default)(r.created_at).tz('Asia/Jakarta').format('YYYY-MM');
            if (!dailyMap[dateStr]) {
                dailyMap[dateStr] = { tanggal: dateStr, jumlah_peserta: 0, total_pendapatan: 0, cash: 0, transfer: 0 };
            }
            dailyMap[dateStr].jumlah_peserta += 1;
            dailyMap[dateStr].total_pendapatan += nominal;
            if (r.metode_bayar === 'tunai')
                dailyMap[dateStr].cash += nominal;
            if (r.metode_bayar === 'transfer')
                dailyMap[dateStr].transfer += nominal;
            if (!monthlyMap[monthStr]) {
                monthlyMap[monthStr] = { bulan: monthStr, jumlah_peserta: 0, total_pendapatan: 0, cash: 0, transfer: 0 };
            }
            monthlyMap[monthStr].jumlah_peserta += 1;
            monthlyMap[monthStr].total_pendapatan += nominal;
            if (r.metode_bayar === 'tunai')
                monthlyMap[monthStr].cash += nominal;
            if (r.metode_bayar === 'transfer')
                monthlyMap[monthStr].transfer += nominal;
        });
        const dailyReports = Object.values(dailyMap).sort((a, b) => b.tanggal.localeCompare(a.tanggal));
        const monthlyReports = Object.values(monthlyMap).sort((a, b) => b.bulan.localeCompare(a.bulan));
        res.json({
            summary: {
                total_revenue: totalRevenue,
                total_peserta: totalPeserta,
                cash: totalCash,
                transfer: totalTF,
                persen_cash: persenCash,
                persen_transfer: persenTransfer
            },
            daily: dailyReports,
            monthly: monthlyReports
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReports = getReports;
