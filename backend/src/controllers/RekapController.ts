import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getByLomba = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lomba_id } = req.params;
    const rekaps = await prisma.rekaps.findMany({
      where: { lomba_id: Number(lomba_id) },
      orderBy: { created_at: 'desc' }
    });
    res.json(rekaps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const storeRekap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lomba_id, nama_peserta, no_wa, nominal_bayar, metode_bayar, status_bayar } = req.body;

    const lomba = await prisma.lombas.findUnique({ where: { id: Number(lomba_id) } });
    if (!lomba) {
      res.status(404).json({ message: 'Lomba not found' });
      return;
    }

    const harga_tiket = lomba.harga_tiket;

    const rekap = await prisma.rekaps.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRekap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nominal_bayar, metode_bayar, status_bayar } = req.body;

    const rekap = await prisma.rekaps.findUnique({ where: { id: Number(id) } });
    if (!rekap) {
      res.status(404).json({ message: 'Data tidak ditemukan' });
      return;
    }

    const updated = await prisma.rekaps.update({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRekap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.rekaps.delete({
      where: { id: Number(id) }
    });

    res.json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Data tidak ditemukan' });
      return;
    }
    res.status(500).json({ error: error.message });
  }
};
