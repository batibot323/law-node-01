const express = require('express')
const taskController = require('./controllers/task-controller');
const app = express()
const port = 3000
// import pkg from 'pg';
const {Pool} = require('pg');
// import { query, getClient } from './db/index.js';
const testPool = require('./db/index.js');

// Problem with using node-postgres just because of conflict in import methodology.
// Need to review ES6 modules and how to reconcile with trying to make a simple app.

async function awit() {  
  let pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'AwitSakit',
  port: 5432, // default PostgreSQL port
});
  await pool.connect()
   
  let res = await pool.query('SELECT $1::text as message', ['This is from Postgres!'])
  console.log(res.rows[0].message) // Hello world!
  // await pool.end()

  console.log('Retrying with another connection');
  pool = new Pool();
  await pool.connect()
   
  res = await testPool.query('SELECT $1::text as message', ['This is from Postgres!'])
  console.log(res.rows[0].message) // Hello world!
  await pool.end()
}

awit();

// end of psql

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/tasks', taskController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})