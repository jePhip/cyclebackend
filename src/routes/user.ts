import { Elysia } from 'elysia'
import initUserController from '../controllers/userController';
import Database from 'bun:sqlite';

export default (db: Database) => {
    const UserController = initUserController(db);

    return new Elysia({ prefix: '/user'})
        .get('/', UserController.getUserList)
        .get('/:username', UserController.getUserByUsername)
        .post('/', UserController.createUser)
        .put('/:username', UserController.updateUser)
        .delete('/:username', UserController.removeUserByUsername)
        .post('/', UserController.validateUser)

}
    
