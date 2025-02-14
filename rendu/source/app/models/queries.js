const { Pool } = require('pg');
const debug = require('debug')('app:postgres');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

// the list of all users
async function getUsers() {
  debug(`getUsers()`);
  const result = await pool.query('SELECT username, email FROM users;');
  return result.rows;
}

// add user
async function addUser(username, email, pwd) {
  debug(`addUser("${username}", "${email}", "${pwd}")`);
  const result = await pool.query(
    'SELECT username FROM users WHERE username = $1;',
    [username]
  );

  const rows = result.rows.length;
  debug(`rows: "${rows}"`);

  // debug(`Check: "${check.username}"`);
  if (rows < 1) {
    const result = await pool.query(
      'INSERT INTO users(username, email, password) VALUES ($1, $2, $3);',
      [username, email, pwd]
    );
    return result;
  }
  const check = result.rows[0];
  debug(`Username: "${check.username}" already exists.`);
  return null;
}

async function selectUser(username) {
  debug(`selectUser("${username}")`);
  const result = await pool.query(
    'SELECT username, email, password FROM users WHERE username = $1 ;',
    [username]
  );
  return result.rows;
}

// Boolean query to check a user/password
async function checkUser(login, pwd) {
  debug(`checkUser("${login}", "${pwd}")`);
  const result = await pool.query(
    'SELECT  FROM users WHERE username=$1 AND password=$2;',
    [login, pwd]
  );
  return result.rowCount === 1;
}

module.exports = { getUsers, checkUser, addUser, selectUser };
