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
      const startTime = performance.now();
      console.log("running query", startTime)

      const query = db.query(`SELECT * FROM routes;`); //create database structure and edit ..change table 'maps?'
      const result = query.all();
      set.status = 200; //OK status
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log("query complete", endTime, "final time = ", elapsedTime); 
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
  
  };
};
