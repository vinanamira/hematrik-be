const db = require('../config/database');

async function checkOnlineDevicesAndNotify() {
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
  }}

async function getNotifications(req, res) {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM Notification_Log ORDER BY notif_time DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markAsSent(req, res) {
  try {
    const { notif_id } = req.params;
    await db.execute(
      'UPDATE Notification_Log SET is_sent = 1 WHERE notif_id = ?',
      [notif_id]
    );
    res.json({ message: 'Ditandai terkirim' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  checkOnlineDevicesAndNotify,
  getNotifications,
  markAsSent,
};