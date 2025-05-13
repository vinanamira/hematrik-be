const db         = require('../config/database');
const mqttClient = require('../config/mqttClient');

async function getAllDevices(req, res) {
  try {
    const [devices] = await db.execute('SELECT * FROM Device');
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDeviceById(req, res) {
  try {
    const { device_id } = req.params;
    const [rows]      = await db.execute('SELECT * FROM Device WHERE device_id =?', [device_id]);
    if (!rows.length) return res.status(404).json({ message: 'Device not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const controllableDevices = ['75AA3A','939788']; 
async function controlDevice(req, res) {
  const { device_id } = req.params;
  const { state }     = req.body; // 'ON' / 'OFF'

  if (!controllableDevices.includes(device_id)) {
    return res.status(403).json({ message: 'Perangkat tidak dapat dikontrol' });
  }

  if (!['ON', 'OFF'].includes(state)) {
    return res.status(400).json({ message: 'State harus ON atau OFF' });
  }

  console.log('200');
  return res.json('jalan');

  // const topic = `EMON25/cmnd/${device_id}/POWER2`;
  // mqttClient.publish(topic, state, {}, err => {
  //   if (err) {
  //     console.error('MQTT publish error:', err);
  //     return res.status(500).json({ message: 'Gagal kirim MQTT' });
  //   }
    
  //   console.log(`[MQTT] ${topic} ← ${state}`);
  //   res.json({ message: `Perangkat ${device_id} dikontrol → ${state}` });
  // });
}

module.exports = {
  getAllDevices,
  getDeviceById,
  controlDevice,
};