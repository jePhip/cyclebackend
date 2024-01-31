import { Elysia } from 'elysia'
import Database from 'bun:sqlite';
import { authenticationHandler } from "../handlers/AuthenticationHandler";


export default (db: Database) => {
  return new Elysia({ prefix: "/auth" })
    .post("/", authenticationHandler.postAuthentications)
    .put("/", authenticationHandler.putAuthentications);
};
