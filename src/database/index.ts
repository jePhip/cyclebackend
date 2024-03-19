import { Database } from "bun:sqlite";
const db = new Database("db.sqlite", { create: true });
//
db.query(
  `CREATE TABLE IF NOT EXISTS routes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route TEXT, 
    name TEXT,
    gpx TEXT,
    difficulty TEXT,
    length DOUBLE,
    terrain TEXT,
    desc TEXT,
    elevation DOUBLE,
    poi TEXT
  );`
).run();

db.query(
  `CREATE TABLE IF NOT EXISTS user(  
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );`
).run();

db.query(`CREATE TABLE IF NOT EXISTS session (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
)`).run();

/*

  route TEXT,
  name TEXT,
  gpx TEXT,
  desc TEXT,
  safe INTEGER,
  length FLOAT/DOUBLE  <--
  terrain TEXT,
  difficulty INTEGER <--
  poi TEXT
*/
export default () => db;
