const db = require('../db/index.js');

class UserService {
    async getUsers() {
        let res = await db.query('SELECT * from users');
        return res.rows;
    }
    async createUser(userName, password) {
        const text = 'INSERT INTO users(user_name, password) VALUES($1, $2) RETURNING *';
        const values = [userName, password];
        let res;
 
        try {
            res = await db.query(text, values)
        } catch (err) {
            // TODO: Add error handling somewhere
            throw err;
        }
        console.log(res.rows[0])
        return res;
    }
  }
  
module.exports = new UserService();
  