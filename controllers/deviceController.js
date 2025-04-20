const mqtt = require('../config/mqttClient');
const db = require('../config/database');

const controllableDevices = ['75AA3A', '939788']; // Dispenser & Lampu

const controlDevice = async (req, res) => {
  const { device_id } = req.params;
  const { state } = req.body; // 'online' or 'offline'

  if (!controllableDevices.includes(device_id)) {
    return res.status(403).json({ message: 'Perangkat tidak dapat dikontrol dari web' });
  }

  if (state !== 'online' && state !== 'offline') {
    return res.status(400).json({ message: 'State harus online atau offline' });
  }

  const topic = `EMON25/tele/${device_id}/LWT`;
  mqtt.publish(topic, state, {}, (err) => {
    if (err) {
      console.error(`[MQTT] Gagal publish ke ${topic}:`, err.message);
      return res.status(500).json({ message: 'Gagal mengirim perintah ke perangkat' });
    }
    console.log(`[MQTT] Publish ke ${topic} dengan payload '${state}'`);
    res.status(200).json({ message: `Perangkat ${device_id} dikontrol: ${state}` });
  });
};

const getAllDevices = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM Device');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const { device_id } = req.params;
    const [rows] = await db.execute('SELECT * FROM Device WHERE device_id = ?', [device_id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Device not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  controlDevice,
  getAllDevices,
  getDeviceById
};