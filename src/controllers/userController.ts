import Database from "bun:sqlite";

export default (db: Database) => {
  return {
    validateUser: ({ body, set }) => {
      console.log("validating")
      const query = db.prepare(
        `SELECT (username,password) FROM users WHERE username = $username`
      );
      const username = body.username;
      const password = body.password;
      query.run({ $username: username, $password: password });

      if (password && username == username + password) {
        set.status = 200;
        return new Response(JSON.stringify({ message: "success!" }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ message: "fail!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },

    getUserList: ({ set }) => {
      const query = db.query(`SELECT * FROM users;`);
      const result = query.all();
      set.status = 200; //OK status

      return new Response(JSON.stringify({ users: result }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    getUserByUsername: ({ params: { username }, set }) => {
      console.log("in get user");
      const query = db.query(`SELECT * FROM users WHERE username = $username;`);
      const result = query.get({ $username: username });
      set.status = 200;

      return new Response(JSON.stringify({ user: result }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    removeUserByUsername: ({ params: { username }, set }) => {
      const query = db.query(`DELETE FROM users WHERE username = $username;`);
      const result = query.get({ $username: username });
      set.status = 200;
      return new Response(JSON.stringify({ message: "success!", username }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    createUser: ({ body, set }) => {
      //body = json content of post request

      const query = db.prepare(
        `INSERT INTO users (username, password) VALUES ($username, $password);`
      );
      const { username, password } = body;
      query.run({ $username: username, $password: password });

      set.status = 200;

      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    updateUser: ({ params: { username }, body, set }) => {
      const attrs = Object.keys(body);
      const updateValues = attrs.map((a) => `${a} = $${a}`).join(`, `);
      let query = db.query(`UPDATE users SET ${updateValues} WHERE username = $username;`);
      let updateObj = {};
      for (let a in body) {
        updateObj = {
          ...updateObj,
          ["$" + a]: body[a],
        };
      }
      console.log(updateObj);
      let result = query.run({ ...updateObj, $username: username });
      set.status = 200;

      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
};
