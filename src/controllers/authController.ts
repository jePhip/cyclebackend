import { Argon2id } from "oslo/password";
import { lucia } from "../index";
import { generateId } from "lucia";
import Database from "bun:sqlite";

export default (db: Database) => {
  return {
    logout: async ({ body, set, cookie: { name } }) => {
      await lucia.invalidateSession(name.value);
      set.status = 200;
      return new Response(
        JSON.stringify({ success: true, message: "signed out" }),
        {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": lucia.createBlankSessionCookie().serialize(),
          },
        }
      );
    },

    login: async ({ body, set }) => {
      const username: string | null = body.username ?? null;
      if (
        !username ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
      ) {
        set.status = 400;
        return new Response(JSON.stringify({ message: "login failed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      const password: string | null = body.password ?? null;
      if (!password || password.length < 6 || password.length > 255) {
        set.status = 400;
        return new Response(JSON.stringify({ message: "login failed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const existingUser = db
        .prepare("SELECT * FROM user WHERE username = ?")
        .get(username);
      if (!existingUser) {
        set.status = 400;
        return new Response(JSON.stringify({ message: "login failed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const validPassword = await new Argon2id().verify(
        existingUser.password,
        password
      );
      if (!validPassword) {
        set.status = 400;
        return new Response(JSON.stringify({ message: "login failed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      const session = await lucia.createSession(existingUser.id, {});
      set.status = 200;
      return new Response(
        JSON.stringify({ success: true, message: "successful signin" }),
        {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": lucia.createSessionCookie(session.id).serialize(),
          },
        }
      );
    },

    signupUser: async ({ body, set }) => {
      try {
        const username: string | null = body.username ?? null;
        if (
          !username ||
          username.length < 3 ||
          username.length > 31 ||
          !/^[a-z0-9_-]+$/.test(username)
        ) {
          set.status = 400;
          return new Response(JSON.stringify({ message: "invalid username" }), {
            headers: { "Content-Type": "application/json" },
          });
        }
        const password: string | null = body.password ?? null;
        if (!password || password.length < 6 || password.length > 255) {
          set.status = 400;
          return new Response(JSON.stringify({ message: "invalid password" }), {
            headers: { "Content-Type": "application/json" },
          });
        }

        const hashedPassword = await new Argon2id().hash(password);
        const userId = generateId(15);

        try {
          db.prepare(
            "INSERT INTO user (id, username, password) VALUES(?, ?, ?)"
          ).run(userId, username, hashedPassword);

          const session = await lucia.createSession(userId, {});
          set.status = 200;
          return new Response(
            JSON.stringify({ success: true, message: "success!" }),
            {
              headers: {
                "Set-Cookie": lucia.createSessionCookie(session.id).serialize(),
              },
            }
          );
        } catch (e) {
          set.status = 500;
          return new Response(JSON.stringify({ message: e.message }), {
            headers: { "Content-Type": "application/json" },
          });
        }
      } catch (e) {
        console.log(e, "e");
      }
    },
  };
};
