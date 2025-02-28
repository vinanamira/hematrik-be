const db = require('../config/database');

exports.getPhotos = (req, res) => {
    db.query('SELECT * FROM Galon_Photo', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.addPhoto = (req, res) => {
    const { photo, device_id, is_urgent } = req.body;
    db.query('INSERT INTO Galon_Photo (photo, device_id, is_urgent) VALUES (?, ?, ?)',
        [photo, device_id, is_urgent || 0], //Default false
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Photo added successfully', photoId: result.insertId });
        }
    );
};

exports.markAsUrgent = (req, res) => {
    const { id } = req.params;
    db.query('UPDATE Galon_Photo SET is_urgent = 1 WHERE photo_id = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated to urgent', affectedRows: result.affectedRows });
    });
};
