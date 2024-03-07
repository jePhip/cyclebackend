import { test, expect } from "bun:test";
import initGeoController from "../controllers/geoGetController.ts";


test("getGeoList returns all routes", async () =>{

    // mock database for testing
    const db = new MockDatabase();
    const geoController = initGeoController(db);

    // mock query 
    const mockRoutes = [{id: 1, name: "Route 1"}, {id: 2, name: "Route 2"}];
    db.mockQuery("SELECT * FROM routes;", [], mockRoutes);

    const request = {};
    const response = await geoController.getGeoList(request);
    const data = await response.json();

    expect(data.routes).toEqual(mockRoutes);
    expect(response.status).toBe(200);

})