const db = require ('../db/index.js');
const jwt = require('jsonwebtoken');

// Keep this secret key in a .env file
const SECRET_KEY = 'super-secret-key';

class AuthService {
    async login(userName, password) {
        const text = 'SELECT * FROM users WHERE user_name = $1;';
        const values = [userName];
        const res = await db.query(text, values);
        const user = res.rows[0];
        if (user && user.password === password) {
            // This will create a new access token for each successful login.
            const accessToken = await jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
            user.jwt_access_token = accessToken;
            const updateText = 'UPDATE users SET jwt_access_token = $1 WHERE id = $2;';
            const updateValues = [accessToken, user.id];
            await db.query(updateText, updateValues);
            return user;
        }

        return 'Invalid username or password.';
    }
}

module.exports = new AuthService();