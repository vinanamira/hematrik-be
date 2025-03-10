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
            return res.status(400).json({ message: "Username or email already exists" });
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(
                'INSERT INTO User (username, password, email) VALUES (?, ?, ?)',
                [username, hash, email],
                (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });

                    res.json({ message: "User registered successfully" });
                }
            );
        });
    });
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM User WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(401).json({ message: "User not found" });
        }
        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });

            if (!isMatch) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = jwt.sign(
                { user_id: user.user_id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({ message: "Login successful", token });
        });
    });
};