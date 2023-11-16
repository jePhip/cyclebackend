import Database from "bun:sqlite";

export default (db: Database) => {
  return {
    getUserList: ({ set }) => {
      const query = db.query(`SELECT * FROM users;`); //create database structure and edit ..change table 'maps?'
      const result = query.all();
      set.status = 200; //OK status

      return new Response(JSON.stringify({ users: result }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    getUserById: ({ params: { id }, set }) => {
        console.log('in get user')
      const query = db.query(`SELECT * FROM users WHERE id = $id;`);
      const result = query.get({ $id: id });
      set.status = 200;

      return new Response(JSON.stringify({ user: result }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    removeUserById: ({ params: { id }, set }) => {
      const query = db.query(`DELETE FROM users WHERE id = $id;`);
      const result = query.get({ $id: id });
      set.status = 200;
      return new Response(JSON.stringify({ message: "success!", id }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    createUser: ({ body, set }) => {
      //body = json content of post request
      
      const query = db.prepare(`INSERT INTO users (username, password) VALUES ($username, $password);`);
      const { username, password } = body;
      query.run({$username: username, $password: password});
  
      set.status = 200;
    
      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    updateUser: ({ params: { id }, body, set }) => {
      const attrs = Object.keys(body);
      const updateValues = attrs.map(a => `${a} = $${a}`).join(`, `)
      let query = db.query(
        `UPDATE users SET ${updateValues} WHERE id = $id;`
      );
      let updateObj = {};
      for(let a in body){
        updateObj = {
        ...updateObj,
        ['$'+ a]: body[a]
        }
      }
      console.log(updateObj)
      let result = query.run({ ...updateObj, $id: id });
      set.status = 200;

      return new Response(JSON.stringify({ message: "success!"}), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
};
