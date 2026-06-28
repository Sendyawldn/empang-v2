import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getLombas = async (req: Request, res: Response): Promise<void> => {
  try {
    const lombas = await prisma.lombas.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(lombas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createLomba = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_lomba, tanggal_lomba, harga_tiket } = req.body;

    if (!nama_lomba || !tanggal_lomba || !harga_tiket) {
      res.status(400).json({ error: 'Validation failed' });
      return;
    }

    const lomba = await prisma.lombas.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLomba = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const lomba = await prisma.lombas.findUnique({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLomba = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.lombas.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: 'Jadwal Lomba berhasil dihapus!'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
