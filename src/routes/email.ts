import { Elysia } from 'elysia';
import initEmailController from '../controllers/emailController';


export default() =>
{ 
  // initialze email controller
  const emailController = initEmailController();

  // define route for email 
  return new Elysia({ prefix: '/email'})
        // use sendmail 
        .post('/', emailController.sendSuggestion)
        
}







