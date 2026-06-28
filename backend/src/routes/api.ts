import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';

import { login, logout } from '../controllers/AuthController';
import { storeBooking, checkStatus, getBookings, storeAdmin, verifyBooking, deleteBooking } from '../controllers/BookingController';
import { getHomeData, storeBooking as storePublicBooking, getJadwalPeserta } from '../controllers/PublicController';
import { getSettings, updateSettings, uploadGallery, deleteGalleryItem } from '../controllers/SettingController';
import { getLombas, createLomba, getLomba, deleteLomba } from '../controllers/LombaController';
import { getByLomba, storeRekap, updateRekap, deleteRekap } from '../controllers/RekapController';
import { getReports } from '../controllers/ReportController';

const router = Router();
const upload = multer({ dest: 'storage/potret/' });

router.post('/bookings', storeBooking);
router.get('/bookings/check/:nama', checkStatus);
router.post('/login', login);

router.get('/public/home', getHomeData);
router.post('/public/booking', storePublicBooking);
router.get('/public/jadwal-peserta', getJadwalPeserta);

router.use(authenticate);

router.post('/logout', logout);

router.get('/admin/dashboard', getBookings);
router.get('/admin/bookings', getBookings);
router.post('/admin/bookings', storeAdmin);
router.put('/admin/bookings/:id/verify', verifyBooking);
router.delete('/admin/bookings/:id', deleteBooking);
router.get('/admin/reports', getReports);

router.get('/admin/settings', getSettings);
router.put('/admin/settings', updateSettings);
router.post('/admin/settings/gallery', upload.array('potret_kami_files[]'), uploadGallery);
router.delete('/admin/settings/gallery', deleteGalleryItem);

router.get('/admin/lombas', getLombas);
router.post('/admin/lombas', createLomba);
router.get('/admin/lombas/:id', getLomba);
router.delete('/admin/lombas/:id', deleteLomba);

router.get('/admin/rekaps/:lomba_id', getByLomba);
router.post('/admin/rekaps', storeRekap);
router.put('/admin/rekaps/:id', updateRekap);
router.delete('/admin/rekaps/:id', deleteRekap);

export default router;
