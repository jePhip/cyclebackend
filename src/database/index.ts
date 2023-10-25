import { Database } from "bun:sqlite";
const db = new Database("mydb.sqlite", { create: true });


db.query(
    `CREATE TABLE IF NOT EXISTS routes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route TEXT, 
    name TEXT,
    gpx TEXT,
    difficulty TEXT,
    length DOUBLE,
    terrain TEXT,
    desc TEXT
  );`
  ).run();

  /*

  route TEXT,
  name TEXT,
  gpx TEXT,
  desc TEXT,
  safe INTEGER,
  length FLOAT/DOUBLE  <--
  terrain TEXT,
  difficulty INTEGER <--
*/
export default () => db;