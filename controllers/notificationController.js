require('dotenv').config();
require('../config/mqttClient');
const db = require('../config/database');
const cron = require('node-cron');

// Fungsi utama: cek perangkat yang masih online dan simpan notifikasi
const checkOnlineDevicesAndNotify = async () => {
  try {
    console.log('[CRON] Mengecek perangkat online untuk notifikasi jam 17.00...');

    // Ambil perangkat yang statusnya online
    const [devices] = await db.execute(
      "SELECT device_id, device_name FROM Device WHERE status = 'online'"
    );

    if (devices.length === 0) {
      console.log('Semua perangkat sudah mati sebelum jam 17.00');
      return;
    }

    // Simpan notifikasi untuk setiap perangkat online
    const notifPromises = devices.map(({ device_id, device_name }) => {
      const notif_message = `${device_name} masih menyala pada pukul 17.00`;
      return db.execute(
        `INSERT INTO Notification_Log (device_id, notif_message, is_sent)
         VALUES (?, ?, ?)`,
        [device_id, notif_message, 0]
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