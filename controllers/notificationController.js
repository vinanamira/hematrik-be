// controllers/notificationController.js
const db   = require('../config/database');
const cron = require('node-cron');

// ① Cron job: simpan notifikasi tiap hari jam 17.00
const checkOnlineDevicesAndNotify = async () => {
  try {
    const [devices] = await db.execute(
      "SELECT device_id, device_name FROM Device WHERE status = 'online'"
    );
    for (const { device_id, device_name } of devices) {
      const notif_message = `${device_name} masih menyala pada pukul 17.00`;
      await db.execute(
        `INSERT INTO Notification_Log 
           (device_id, notif_message, is_sent, notif_time)
         VALUES (?, ?, 0, NOW())`,
        [device_id, notif_message]
      );
    }
    console.log(`[CRON] ${devices.length} notifikasi disimpan.`);
  } catch (err) {
    console.error('[CRON] Gagal menyimpan notifikasi:', err.message);
  }
};

// schedule cron job (pastikan ini di-require sekali di server.js)
cron.schedule('0 17 * * *', () => {
  console.log('[CRON] Trigger notifikasi 17.00 WIB');
  checkOnlineDevicesAndNotify();
}, { timezone: 'Asia/Jakarta' });

// ② Ambil **satu notifikasi terbaru per device** (max 3)
const getNotifications = async (req, res) => {
  try {
    const [devices] = await db.execute('SELECT device_id, device_name FROM Device');
    const result = [];
    for (const { device_id, device_name } of devices) {
      const [[notif]] = await db.execute(
        `SELECT * FROM Notification_Log
         WHERE device_id = ?
         ORDER BY notif_time DESC
         LIMIT 1`,
        [device_id]
      );
      if (notif) result.push({ device_id, device_name, ...notif });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ③ Tandai notifikasi sudah dikirim / dibaca
const markAsSent = async (req, res) => {
  try {
    const { notif_id } = req.params;
    const [result] = await db.execute(
      'UPDATE Notification_Log SET is_sent = 1 WHERE notif_id = ?',
      [notif_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notifikasi tidak ditemukan' });
    }
    res.json({ message: 'Notifikasi ditandai terkirim' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  checkOnlineDevicesAndNotify,
  getNotifications,
  markAsSent
};