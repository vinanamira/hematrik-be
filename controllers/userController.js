const db = require('../config/database');

exports.getUsers = (req, res) => {
    db.query('SELECT * FROM User', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.createUser = (req, res) => {
    const { username, password, email } = req.body;
    db.query('INSERT INTO User (username, password, email) VALUES (?, ?, ?)',
        [username, password, email],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'User created successfully', userId: result.insertId });
        }
    );
};
