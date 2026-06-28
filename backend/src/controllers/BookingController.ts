import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import moment from 'moment-timezone';

export const storeBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama_peserta, tanggal_lomba } = req.body;

    if (!nama_peserta || !tanggal_lomba) {
      res.status(400).json({ error: 'Validation failed' });
      return;
    }

    const booking = await prisma.bookings.create({
      data: {
        nama_peserta,
        status: 'pending'
      }
    });

    res.json({
      success: true,
      message: 'Booking berhasil disimpan!'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const storeAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lomba_id, nama_peserta, no_wa } = req.body;

    if (!lomba_id || !nama_peserta) {
      res.status(400).json({ error: 'Validation failed' });
      return;
    }

    const booking = await prisma.bookings.create({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const checkStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nama } = req.params;
    let booking = null;

    if (String(nama).toUpperCase().startsWith('CMBR-')) {
      const id = parseInt(String(nama).toUpperCase().replace('CMBR-', ''), 10);
      booking = await prisma.bookings.findUnique({
        where: { id },
        include: { lombas: true }
      });
    } else {
      booking = await prisma.bookings.findFirst({
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
        dibuat_pada: moment(booking.created_at).format('DD MMM YYYY HH:mm')
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await prisma.bookings.findMany({
      orderBy: { created_at: 'desc' },
      include: { lombas: true }
    });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await prisma.bookings.findUnique({ where: { id: Number(id) } });
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Data tiket tidak ditemukan.'
      });
      return;
    }

    await prisma.bookings.update({
      where: { id: Number(id) },
      data: { status: 'verified' }
    });

    res.json({
      success: true,
      message: 'Tiket atas nama ' + booking.nama_peserta + ' berhasil diverifikasi!'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const report = async (req: Request, res: Response): Promise<void> => {
  try {
    const hargaTiket = 100000;

    const totalPendaftar = await prisma.bookings.count();
    const pesertaLunas = await prisma.bookings.count({ where: { status: 'verified' } });
    const pesertaPending = await prisma.bookings.count({ where: { status: 'pending' } });

    const totalPendapatan = pesertaLunas * hargaTiket;

    const daftarLunas = await prisma.bookings.findMany({
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.bookings.delete({
      where: { id: Number(id) }
    });

    res.json({
      success: true,
      message: 'Peserta berhasil dihapus, slot kembali tersedia'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
