const db = require('../config/mqttClient');
const cron = require('node-cron');

const checkOnlineDevicesAndNotify = async () => {
  try {
    const [devices] = await db.execute(
      "SELECT device_id, device_name FROM Device WHERE status = 'online'"
    );

    if (!devices.length) {
      console.log('Semua perangkat sudah mati sebelum jam 17.00');
      return;
    }

    const notifPromises = devices.map(device => {
      const message = `${device.device_name} masih menyala, harap segera dimatikan!`;
      return db.execute(
        `INSERT INTO Notification_Log (device_id, notif_message, is_sent)
         VALUES (?, ?, 0)`,
        [device.device_id, message]
      );
    });

    await Promise.all(notifPromises);
    console.log(`Notifikasi dibuat untuk ${devices.length} perangkat`);
  } catch (err) {
    console.error('Gagal menjalankan notifikasi:', err.message);
  }
};

cron.schedule('0 17 * * *', () => {
  checkOnlineDevicesAndNotify();
});

module.exports = { checkOnlineDevicesAndNotify };