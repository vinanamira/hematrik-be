require('dotenv').config();
const cron = require('node-cron');
const { checkOnlineDevicesAndNotify } = require('../controllers/notificationController');

cron.schedule('0 17 * * *', async () => {
  try {
    console.log('[AUTO] Menjalankan notifikasi otomatis jam 17.00 WIB...');
    await checkOnlineDevicesAndNotify();
  } catch (error) {
    console.error('[AUTO] Gagal menjalankan cron:', error);
  }
}, {
  timezone: 'Asia/Jakarta',
  scheduled: true,
});