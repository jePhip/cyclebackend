import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import initDB from "./database";
import initGeo from "./routes/geo";
import initUsers from "./routes/user";
import { AuthenticationError } from "./exceptions/AuthenticationError";
import { AuthorizationError } from "./exceptions/AuthorizationError";
import { InvariantError } from "./exceptions/InvariantError";
import bearer from "@elysiajs/bearer";
import { jwt } from "@elysiajs/jwt";
const db = initDB();

const app = new Elysia() //
  .use(cors()) //
  .use(
    swagger({
      //documentation
      path: "/v1/docs",
      documentation: {
        info: {
          title: "Geo App Documentation",
          version: "1.0.0",
        },
      },
    })
  )
  .error("AUTHENTICATION_ERROR", AuthenticationError)
  .error("AUTHORIZATION_ERROR", AuthorizationError)
  .error("INVARIANT_ERROR", InvariantError)
  .onError(({ code, error, set }) => {
    switch (code) {
      case "AUTHENTICATION_ERROR":
        set.status = 401;
        return {
          status: "error",
          message: error.toString().replace("Error: ", ""),
        };
      case "AUTHORIZATION_ERROR":
        set.status = 403;
        return {
          status: "error",
          message: error.toString().replace("Error: ", ""),
        };
      case "INVARIANT_ERROR":
        set.status = 400;
        return {
          status: "error",
          message: error.toString().replace("Error: ", ""),
        };
      case "NOT_FOUND":
        set.status = 404;
        return {
          status: "error",
          message: error.toString().replace("Error: ", ""),
        };
      case "INTERNAL_SERVER_ERROR":
        set.status = 500;
        return {
          status: "error",
          message: "Something went wrong!",
        };
    }
  })
  .use(
    jwt({
      name: "jwt",
      secret: "secret",
      exp: "7d",
    })
  )
  .group("/v1", (app) =>
    app //group of endpoints
      .use(initGeo(db)) //list of crud endpoints
      .use(initUsers(db))
  )
  .derive(async ({ bearer, jwt }) => {
    const token = await jwt.verify(bearer);

    return {
      userId: token.id,
    };
  })
  .listen(3000);

console.log(`API is running at ${app.server?.hostname}:${app.server?.port}`);
