const {Pool} = require('pg');

class MyPool {
    constructor() { 
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'postgres',
            password: 'AwitSakit',
            port: 5432, // default PostgreSQL port
        });
    }

    query = (text, params) => this.pool.query(text, params);

    getClient = () => {
        return this.pool.connect()
    }
}

module.exports = new MyPool();