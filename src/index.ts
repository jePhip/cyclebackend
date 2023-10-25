import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import initDB from './database';
import initGeo from './routes/geo';

const db = initDB();

const app = new Elysia()
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
  )
  .listen(3000);


console.log(
  `Geo App is running at ${app.server?.hostname}:${app.server?.port}`
);
