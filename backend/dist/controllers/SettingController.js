"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryItem = exports.uploadGallery = exports.updateSettings = exports.getSettings = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getSettings = async (req, res) => {
    try {
        let setting = await prisma_1.default.settings.findFirst();
        if (!setting) {
            setting = await prisma_1.default.settings.create({
                data: {
                    nama_pemancingan: 'Nama Empang Lu',
                    nomor_wa: '08123456789',
                    lokasi: 'Alamat Empang',
                    info_rekening: 'Bank Mandiri 123456789 a/n Nama Lu'
                }
            });
        }
        res.json(setting);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const { nama_pemancingan, nomor_wa, lokasi, info_rekening, peraturan_empang } = req.body;
        if (!nama_pemancingan || !nomor_wa || !lokasi || !info_rekening) {
            res.status(400).json({ error: 'Validation failed' });
            return;
        }
        const setting = await prisma_1.default.settings.findFirst();
        if (!setting) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }
        const updated = await prisma_1.default.settings.update({
            where: { id: setting.id },
            data: {
                nama_pemancingan,
                nomor_wa,
                lokasi,
                info_rekening,
                peraturan_empang
            }
        });
        res.json({ message: 'Pengaturan berhasil disimpan!', data: updated });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateSettings = updateSettings;
const uploadGallery = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            res.status(400).json({ error: 'No files provided' });
            return;
        }
        const setting = await prisma_1.default.settings.findFirst();
        if (!setting) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }
        let existingImages = [];
        if (setting.potret_kami) {
            try {
                existingImages = typeof setting.potret_kami === 'string'
                    ? JSON.parse(setting.potret_kami)
                    : setting.potret_kami;
            }
            catch (e) {
                existingImages = [];
            }
        }
        files.forEach(file => {
            // Create path similar to Laravel's output
            existingImages.push('/storage/potret/' + file.filename);
        });
        // Remove duplicates
        existingImages = [...new Set(existingImages)];
        const updated = await prisma_1.default.settings.update({
            where: { id: setting.id },
            data: {
                potret_kami: JSON.stringify(existingImages) // Storing as JSON string to match schema if it was text/json
            }
        });
        // Note: If potret_kami is JSON in MySQL, you might just pass the array if Prisma expects it.
        // Assuming string for now based on Laravel implementation string checks.
        res.json({ message: 'Foto berhasil diunggah!', data: updated });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.uploadGallery = uploadGallery;
const deleteGalleryItem = async (req, res) => {
    try {
        const { image_url } = req.body;
        if (!image_url) {
            res.status(400).json({ error: 'image_url is required' });
            return;
        }
        const setting = await prisma_1.default.settings.findFirst();
        if (!setting) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }
        let existingImages = [];
        if (setting.potret_kami) {
            try {
                existingImages = typeof setting.potret_kami === 'string'
                    ? JSON.parse(setting.potret_kami)
                    : setting.potret_kami;
            }
            catch (e) { }
        }
        const newImages = existingImages.filter(img => img !== image_url);
        const updated = await prisma_1.default.settings.update({
            where: { id: setting.id },
            data: {
                potret_kami: JSON.stringify(newImages)
            }
        });
        res.json({ message: 'Foto berhasil dihapus!', data: updated });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteGalleryItem = deleteGalleryItem;
