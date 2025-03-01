const db = require('../config/database');

exports.getLogs = (req, res) => {
    db.query('SELECT * FROM Electricity_Log', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.addLog = (req, res) => {
    const { device_id, voltage, current, kwh } = req.body;
    if (!device_id || voltage === undefined || current === undefined || kwh === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    db.query(
        'INSERT INTO Electricity_Log (device_id, voltage, current, kwh) VALUES (?, ?, ?, ?)',
        [device_id, voltage, current, kwh],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Electricity log added successfully', logId: result.insertId });
        }
    );
};
