const db = require('../config/database');

async function getAllLogs(req, res) {
  try {
    const [logs] = await db.execute(
      'SELECT * FROM Electricity_Log ORDER BY time_recorded DESC'
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLogsByDevice(req, res) {
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
}

async function getAllLatestLogs(req, res) {
  try {
    const [logs] = await db.execute(`
      SELECT e.*
      FROM Electricity_Log AS e
      INNER JOIN (
        SELECT device_id, MAX(time_recorded) AS max_time
        FROM Electricity_Log
        GROUP BY device_id
      ) AS sub
        ON e.device_id = sub.device_id
       AND e.time_recorded = sub.max_time
    `);
    
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getLatestByDevice(req, res) {
  try {
    const { device_id } = req.params;
    const [rows] = await db.execute(
      `SELECT * FROM Electricity_Log
       WHERE device_id = ?
       ORDER BY time_recorded DESC
       LIMIT 1`,
      [device_id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllLogs,
  getLogsByDevice,
  getAllLatestLogs,
  getLatestByDevice,
};