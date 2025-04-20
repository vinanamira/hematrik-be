require('dotenv').config();
const { checkOnlineDevicesAndNotify } = require('../controllers/notificationController');

(async () => {
  try {
    await checkOnlineDevicesAndNotify();
    console.log('Cron job selesai dijalankan.');
  } catch (error) {
    console.error('Gagal menjalankan cron job:', error);
  }
})();