require('dotenv').config();
const cron = require('node-cron');
const { checkOnlineDevicesAndNotify } = require('../controllers/notificationController');

cron.schedule('0 17 * * *', async () => {
  console.log('[AUTO] Triggering daily notifications');
  await checkOnlineDevicesAndNotify();
}, {
  scheduled: true,
  timezone: 'Asia/Jakarta'
});