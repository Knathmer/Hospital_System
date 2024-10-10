import { query } from '../database.js';  // Import the query function

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to find the user by email
        const sql = 'SELECT * FROM patient WHERE email = ?';
        const users = await query(sql, [email]);

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
        return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
