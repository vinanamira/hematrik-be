require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');

exports.getUsers = (req, res) => {
    db.query('SELECT user_id, username, email FROM User', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

exports.registerUser = (req, res) => {
    const { username, password, email } = req.body;

    db.query('SELECT * FROM User WHERE username = ? OR email = ?', [username, email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.status(400).json({ message: "Username atau email sudah terdaftar" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(
                'INSERT INTO User (username, password, email) VALUES (?, ?, ?)',
                [username, hash, email],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: "Registrasi Berhasil" });
                }
            );
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM User WHERE LOWER(email) = LOWER(?)', [email.trim()], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: "Pengguna tidak ditemukan" });
        }
        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!isMatch) {
                return res.status(401).json({ message: "Password salah!" });
            }

            const token = jwt.sign(
                { user_id: user.user_id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: "Berhasil Login!", token });
        });
    });
};