const db = require('../config/database');

const getLogsByDevice = async (req, res) => {
  try {
    const { device_id } = req.params;
    const [logs] = await db.execute(
      'SELECT * FROM Electricity_Log WHERE device_id = ? ORDER BY time_recorded DESC',
      [device_id]
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllLogs = async (req, res) => {
  try {
    const [logs] = await db.execute(
      'SELECT * FROM Electricity_Log ORDER BY time_recorded DESC'
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getLogsByDevice,
  getAllLogs
};