import { lucia } from "../index";
import { Elysia } from "elysia";

// export default () => async (req, res, next) => {
// 	const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
// 	if (!sessionId) {
// 		res.locals.user = null;
// 		res.locals.session = null;
// 		return next();
// 	}

// 	const { session, user } = await lucia.validateSession(sessionId);
// 	if (session && session.fresh) {
// 		res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
// 	}
// 	if (!session) {
// 		res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
// 	}
// 	res.locals.session = session;
// 	res.locals.user = user;
// 	return next();
// });
export default (app) => {
  return app.use(async ({ cookie: { name }, set }) => {
    const sessionId = lucia.readSessionCookie(name.value ?? "");
    if (!sessionId) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }
    const { session, user } = await lucia.validateSession(sessionId);
    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    // const user = await prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
    // if (!user) {
    //   set.status = 401;
    //   return {
    //     success: false,
    //     message: "Unauthorized",
    //     data: null,
    //   };
    // }
    return {
      user,
    };
  });
};
