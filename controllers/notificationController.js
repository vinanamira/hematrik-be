const db = require('../config/database');

const checkOnlineDevicesAndNotify = async () => {
  try {
    console.log('[CRON] Mengecek perangkat online untuk notifikasi jam 17.00...');

    const [devices] = await db.execute(
      "SELECT device_id, device_name FROM Device WHERE status = 'online'"
    );

    if (devices.length === 0) {
      console.log('Semua perangkat sudah mati sebelum jam 17.00');
      return;
    }

    const notifPromises = devices.map(({ device_id, device_name }) => {
      const notif_message = `${device_name} masih menyala pada pukul 17.00`;
      const notif_time = new Date();

      return db.execute(
        `INSERT INTO Notification_Log (device_id, notif_message, is_sent, notif_time)
         VALUES (?, ?, ?, ?)`,
        [device_id, notif_message, 0, notif_time]
      );
    });

    await Promise.all(notifPromises);
    console.log(`[CRON] ${devices.length} notifikasi berhasil disimpan ke database.`);

  } catch (error) {
    console.error('[CRON] Gagal menjalankan notifikasi:', error.message);
  }
};

module.exports = { checkOnlineDevicesAndNotify };