const db = require('../config/mqttClient');

exports.getAllDevices = async (req, res) => {
  try {
    const [devices] = await db.execute('SELECT * FROM Device');
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};