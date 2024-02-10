import { Elysia } from 'elysia'
import initGetGeoController from '../controllers/geoGetController';
import Database from 'bun:sqlite';


export default (db: Database) => {
    const GeoController = initGetGeoController(db);

    return new Elysia({ prefix: '/geo'})
        .get('/', GeoController.getGeoList)
        .get('/:id', GeoController.getGeoById)
        // .post('/e', GeoController.getElevation)
        
        
}