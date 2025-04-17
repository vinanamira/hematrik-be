const db = require('../config/mqttClient');

exports.getLogsByDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const [logs] = await db.execute('SELECT * FROM Electricity_Log WHERE device_id = ? ORDER BY time_recorded DESC', [device_id]);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};