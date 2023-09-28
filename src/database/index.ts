import { Database } from "bun:sqlite";

const db = new Database(":memory:");


db.query(
    `CREATE TABLE IF NOT EXISTS routes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    route TEXT, 
    name TEXT,
    gpx TEXt
  );`
  ).run();

export default () => db;