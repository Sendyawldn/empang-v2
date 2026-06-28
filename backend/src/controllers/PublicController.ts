import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import moment from 'moment-timezone';

const parseSettings = (setting: any) => {
  if (setting && typeof setting.potret_kami === 'string') {
    try {
      setting.potret_kami = JSON.parse(setting.potret_kami);
    } catch (e) {
      setting.potret_kami = [];
    }
  }
  return setting;
};

export const getHomeData = async (req: Request, res: Response): Promise<void> => {
  try {
    const todayJakarta = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    const settings = await prisma.settings.findFirst();

    // In Prisma, we query lombas and include bookings to compute counts
    const lombas = await prisma.lombas.findMany({
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

    const formattedLombas = lombas.map((l: any) => {
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
      settings: parseSettings(settings),
      lombas: formattedLombas
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const storeBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lomba_id, nama_peserta, no_wa } = req.body;

    if (!lomba_id || !nama_peserta || !no_wa) {
      res.status(400).json({ error: 'Validation failed' });
      return;
    }

    const booking = await prisma.bookings.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getJadwalPeserta = async (req: Request, res: Response): Promise<void> => {
  try {
    const todayJakarta = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');

    const lombas = await prisma.lombas.findMany({
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

    const data = lombas.map((l: any) => {
      const pesertaNames: string[] = [];

      l.rekaps.forEach((r: any) => {
        if (r.nama_peserta) {
          pesertaNames.push(r.nama_peserta);
        }
      });

      l.bookings.forEach((b: any) => {
        if (
          b.nama_peserta &&
          ['pending', 'verified'].includes(b.status || '') &&
          !pesertaNames.includes(b.nama_peserta)
        ) {
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
