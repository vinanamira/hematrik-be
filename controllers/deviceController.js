const db = require('../config/database');

exports.getDevices = (req, res) => {
    db.query('SELECT * FROM Device', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createDevice = (req, res) => {
    const { user_id, location } = req.body;
    db.query('INSERT INTO Device (user_id, location) VALUES (?, ?)',
        [user_id, location],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Device added successfully', deviceId: result.insertId });
        }
    );
};
