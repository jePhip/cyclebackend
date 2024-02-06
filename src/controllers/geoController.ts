import Database from "bun:sqlite";
import fetch from "node-fetch";

export default (db: Database) => {
  return {
    // getElevation: async ({ body, set }) => {
    //   const length = Object.keys(body).length;
    //   let reqString = `https://api.open-elevation.com/api/v1/lookup?locations=`;
    //   reqString += `${body[0].latitude},${body[0].longitude}`;
    //   for (let i = 1; i < length; i++) {
    //     //console.log(body[i], body[i].latitude, body[i].longitude)
    //     reqString += `|${body[i].latitude},${body[i].longitude}`;
    //   }
    //   console.log(reqString);
    //   // let res = await fetch(`https://maps.googleapis.com/maps/api/elevation/json?path=${body.lat2},%2C${body.long2}|-34.397,150.644&units=imperial&mode=bicycling&key=AIzaSyApfskDsY7qidZT_vJMhfEUeZwXcqQqo-A`);
    //   let res = await fetch(reqString);

    //   const response = await res.json();
    //   set.status = 200;
    //   // const response = await res.json()
    //   // console.log(response)
    //   return new Response(JSON.stringify({ response }), {
    //     headers: { "Content-Type": "application/json" },
    //   });
    // },

    getGeoList: ({ set }) => {
      console.log("running query")

      const query = db.query(`SELECT * FROM routes;`); //create database structure and edit ..change table 'maps?'
      const result = query.all();
      set.status = 200; //OK status
      console.log("query complete", JSON.stringify(result[-1]))
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
      return new Response(JSON.stringify({ message: "success!", id }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    createGeo: ({ body, set }) => {
      //body = json content of post request
      console.log("running query")
      const query = db.prepare(
        `INSERT INTO routes (route, name, gpx, length, difficulty, terrain, desc, elevation) VALUES ($route, $name, $gpx, $length, $difficulty, $terrain, $desc, $elevation);`
      );
      const { route, name, gpx, length, difficulty, terrain, desc, elevation } =
        body;
      query.run({
        $route: JSON.stringify(route),
        $name: name,
        $gpx: gpx,
        $length: length,
        $difficulty: difficulty,
        $terrain: terrain,
        $desc: desc,
        $elevation: elevation,
      });
      console.log("query complete")
      set.status = 200;

      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
    updateGeo: ({ params: { id }, body, set }) => {
      const attrs = Object.keys(body);
      const updateValues = attrs.map((a) => `${a} = $${a}`).join(`, `);
      let query = db.query(`UPDATE routes SET ${updateValues} WHERE id = $id;`);
      let updateObj = {};
      for (let a in body) {
        updateObj = {
          ...updateObj,
          ["$" + a]: body[a],
        };
      }
      console.log(updateObj);
      let result = query.run({ ...updateObj, $id: id });
      set.status = 200;

      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
};
