import Database from "bun:sqlite";

export default (db: Database) => {
  return {
    getGeoList: ({ set }) => {
      const query = db.query(`SELECT * FROM routes;`); //create database structure and edit ..change table 'maps?'
      const result = query.all();
      set.status = 200;

      return new Response(JSON.stringify({ routes: result }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    getGeoById: ({ params: { id }, set }) => {
      const query = db.query(`SELECT * FROM routes WHERE id = $id;`);
      const result = query.get({ $id: id });
      set.status = 200;

      return new Response(JSON.stringify({ route: result }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    removeGeoById: ({ params: { id }, set }) => {
      const query = db.query(`DELETE FROM routes WHERE id = $id;`);
      const result = query.get({ $id: id });
      set.status = 200;

      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    createGeo: ({ body, set }) => {
      //body = json content of post request
      
      const query = db.prepare(`INSERT INTO routes (route, name, gpx) VALUES ($route, $name, $gpx);`);
      const { route, name, gpx } = body;
      query.run({ $route: JSON.stringify(route), $name: name, $gpx: gpx });

      set.status = 200;

      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    updateGeo: ({ params: { id }, body, set }) => {
      const attrs = Object.keys(body);
      const updateValues = attrs.map(a => `${a} = $${a}`).join(`, `)
      let query = db.query(
        `UPDATE routes SET ${updateValues} WHERE id = $id;`
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
