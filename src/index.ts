import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import initDB from "./database";
import initGeo from "./routes/geo";
import initUsers from "./routes/user";
import { jwt } from "@elysiajs/jwt";
import { Lucia } from "lucia";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import { isAuthenticated } from "./middleware/auth";
import initAuth from "./routes/auth";
import { cookie } from "@elysiajs/cookie";
import authMiddleware from "./middleware/authMiddleware";
import auth from "./routes/auth";
export const db = initDB();
export const adapter = new BunSQLiteAdapter(db, {
  user: "user",
  session: "session",
});
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    };
  },
});

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
  .use(isAuthenticated)
  .use(initAuth(db))
  .on("beforeHandle", async ({ cookie, set, request }) => {
    const cookieHeader = request.headers.get("Cookie") ?? "";
    const sessionId = lucia.readSessionCookie(cookieHeader);
    console.log(cookie, "cookie");
    console.log(sessionId, "sessionid");
    if (!sessionId) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    const { session, user } = await lucia.validateSession(sessionId);
    console.log(session, user, "sesion, user");
    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
  })
  .group("/v1", (app) =>
    app

      //group of endpoints
      .use(initGeo(db)) //list of crud endpoints
      .use(initUsers(db))
  )

  .listen(3000);

console.log(`API is running at ${app.server?.hostname}:${app.server?.port}`);

// .on("beforeHandle", async ({ cookie, set }) => {
//   const cookieHeader = context.request.headers.get("Cookie") ?? "";
//   const sessionId = lucia.readSessionCookie(cookieHeader);
//   console.log(cookie, "cookie");
//   console.log(sessionId, "sessionid");
//   if (!sessionId) {
//     set.status = 401;
//     return {
//       success: false,
//       message: "Unauthorized",
//       data: null,
//     };
//   }
//   const { session, user } = await lucia.validateSession(sessionId);
//   console.log(session, user, "sesion, user");
//   if (!user) {
//     set.status = 401;
//     return {
//       success: false,
//       message: "Unauthorized",
//       data: null,
//     };
//   }
// })
