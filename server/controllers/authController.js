// controllers/authController.js
const db = require('../database'); // Import database functions
// const bcrypt = require('bcrypt'); // For password hashing (if passwords are hashed)

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to find the user by email
        const sql = 'SELECT * FROM patient WHERE email = ?';
        const users = await db.query(sql, [email]);

        if (users.length === 0) {
            // User not found
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // If passwords were hashed, compare the password using bcrypt (currently disabled)
        // const match = await bcrypt.compare(password, user.password);

        // For now, just compare the plain text password
        if (password !== user.password) {
            // Password does not match
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Authentication successful
        // Generate a session or token here (e.g., JWT)
        return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
