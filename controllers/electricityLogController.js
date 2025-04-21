const db = require('../config/database');

const getAllLogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 100;
    const [logs] = await db.execute(
      'SELECT * FROM Electricity_Log ORDER BY time_recorded DESC LIMIT ?',
      [limit]
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const getLatestLogsAll = async (req, res) => {
  try {
    const [devices] = await db.execute('SELECT device_id, device_name FROM Device');
    const result = [];
    for (const { device_id, device_name } of devices) {
      const [[log]] = await db.execute(
        'SELECT * FROM Electricity_Log WHERE device_id = ? ORDER BY time_recorded DESC LIMIT 1',
        [device_id]
      );
      if (log) result.push({ device_id, device_name, ...log });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllLogs,
  getLogsByDevice,
  getLatestLogsAll
};