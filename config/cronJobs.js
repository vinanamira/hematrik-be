require('dotenv').config(); 
const { checkOnlineDevicesAndNotify } = require('../controllers/notificationController');
const db = require('./database'); 

(async () => {
  try {
    await checkOnlineDevicesAndNotify();
    console.log('Cron job selesai dijalankan.');
  } catch (error) {
    console.error('Gagal menjalankan cron job:', error);
  } finally {
    db.end(); 
  }
})();