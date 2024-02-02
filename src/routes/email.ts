import { Elysia } from 'elysia';
import initEmailController from '../controllers/emailController';

//import { sendMail } from './emailController.js'; // Import controller function

export default() =>
{ 
  const emailController = initEmailController();

  return new Elysia({ prefix: '/email'})
        .post('/', () => 'success')
        
}



/*const app = new Elysia();

app.post('/email', async (req) => {
    try {
      await sendEmail(req);
      return new Response('Email sent successfully!', { status: 200 });
    } catch (error) {
      return new Response('Failed to send email.', { status: 500 });
    }
  });
  */



