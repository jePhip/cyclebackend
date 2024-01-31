import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import initDB from './database';
import initGeo from './routes/geo';
import initUsers from './routes/user'
import { jwt } from '@elysiajs/jwt'
import { Lucia } from "lucia";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";

import signup from './routes/signup'

export const db = initDB();
export const adapter = new BunSQLiteAdapter(db, {
	user: "user",
	session: "session"
});
export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username
		};
	}
});

const app = new Elysia()//
  .use(cors())//
  .use(swagger({//documentation
    path: '/v1/docs',
    documentation: {
      info: {
          title: 'Geo App Documentation',
          version: '1.0.0'
      }
    }
  }))
  .group('/v1', app => app//group of endpoints
    .use(initGeo(db))//list of crud endpoints
    .use(initUsers(db))
    .use(signup(db))
  )
  .listen(3000);


console.log(
  `API is running at ${app.server?.hostname}:${app.server?.port}`
);
