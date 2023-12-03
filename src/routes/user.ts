import { Elysia } from 'elysia'
import initUserController from '../controllers/userController';
import Database from 'bun:sqlite';

export default (db: Database) => {
    const UserController = initUserController(db);

    return new Elysia({ prefix: '/user'})
        .get('/', UserController.getUserList)
        .get('/:id', UserController.getUserById)
        .post('/', UserController.createUser)
        .put('/:id', UserController.updateUser)
        .delete('/:id', UserController.removeUserById)
        .post('/:username', UserController.validateUser)
}
    
