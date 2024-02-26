import { lucia } from "../index";
import { Elysia } from "elysia";
import { verifyRequestOrigin } from "lucia";

import type { User, Session } from "lucia";
//decorates the request with user and session objects

export const isAuthenticated = (app: Elysia) =>
  app.derive(
    async (
      context
    ): Promise<{ user: User | null; session: Session | null }> => {
      try {
        // CSRF check
        

        if (context.request.method !== "GET") {
          const originHeader = context.request.headers.get("Origin");
          // NOTE: You may need to use `X-Forwarded-Host` instead
          const hostHeader = context.request.headers.get("Host");
          if (
            !originHeader ||
            !hostHeader ||
            !verifyRequestOrigin(originHeader, [hostHeader])
          ) {
            return {
              user: null,
              session: null,
            };
          }
        }

        // use headers instead of Cookie API to prevent type coercion
        const cookieHeader = context.request.headers.get("Cookie") ?? "";
        const sessionId = lucia.readSessionCookie(cookieHeader);
        if (!sessionId) {
          return {
            user: null,
            session: null,
          };
        }

        const { session, user } = await lucia.validateSession(sessionId);
        if (session && session.fresh) {
          const sessionCookie = lucia.createSessionCookie(session.id);
          context.cookie[sessionCookie.name].set({
            value: sessionCookie.value,
            ...sessionCookie.attributes,
          });
        }
        if (!session) {
          const sessionCookie = lucia.createBlankSessionCookie();
          context.cookie[sessionCookie.name].set({
            value: sessionCookie.value,
            ...sessionCookie.attributes,
          });
        }
        return {
          user,
          session,
        };
      } catch (e) {console.log(e)}
    }
  );

// // export default () => async (req, res, next) => {
// // 	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
// // 	if (!sessionId) {
// // 		res.locals.user = null;
// // 		res.locals.session = null;
// // 		return next();
// // 	}

// // 	const { session, user } = await lucia.validateSession(sessionId);
// // 	if (session && session.fresh) {
// // 		res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
// // 	}
// // 	if (!session) {
// // 		res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
// // 	}
// // 	res.locals.session = session;
// // 	res.locals.user = user;
// // 	return next();
// // });
// export default (app) => {
//   return app.use(async ({ cookie: { name }, set }) => {
//     const sessionId = lucia.readSessionCookie(name.value ?? "");
//     if (!sessionId) {
//       set.status = 401;
//       return {
//         success: false,
//         message: "Unauthorized",
//         data: null,
//       };
//     }
//     const { session, user } = await lucia.validateSession(sessionId);
//     if (!user) {
//       set.status = 401;
//       return {
//         success: false,
//         message: "Unauthorized",
//         data: null,
//       };
//     }

//     // const user = await prisma.user.findUnique({
//     //   where: {
//     //     id: userId,
//     //   },
//     // });
//     // if (!user) {
//     //   set.status = 401;
//     //   return {
//     //     success: false,
//     //     message: "Unauthorized",
//     //     data: null,
//     //   };
//     // }
//     return {
//       user,
//     };
//   });
// };
