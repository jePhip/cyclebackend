import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";
import initDB from "./database";
import initGetGeo from "./routes/getGeo";
import initUsers from "./routes/user";
import { Lucia } from "lucia";
import { BunSQLiteAdapter } from "@lucia-auth/adapter-sqlite";
import { isAuthenticated } from "./middleware/auth";
import initAuth from "./routes/auth";
import { cookie } from "@elysiajs/cookie";
import auth from "./routes/auth";
import initEmail from "./routes/email";
import initEditGeo from "./routes/editGeo";
import { staticPlugin } from "@elysiajs/static";
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
}); //

const app = new Elysia() //
  .use(
    staticPlugin({
      prefix: "/",
      alwaysStatic: true,
    })
  )
  .use(
    cors({
      credentials: true,
    })
  ) //
  .use(
    swagger({
      //
      //
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

  .group("/v1", (app) =>
    app.use(initGetGeo(db)).use(initEmail()).use(initAuth(db))
  ) //routes that that don't require authorization

  .group("/a1", (app) =>
    app
      .use(isAuthenticated)
      .on("beforeHandle", async ({ set, user, session }) => {
        if (!session) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized",
            data: null,
          };
        }

        if (!user) {
          set.status = 401;
          return {
            success: false,
            message: "Unauthorized",
            data: null,
          };
        }
      })
      //group of endpoints
      .use(initEditGeo(db)) //list of crud endpoints
      .use(initUsers(db))
  )
  .get("/*", async () => {
    return Bun.file("./public/index.html");
  })

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
