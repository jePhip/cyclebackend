import nodemailer from 'nodemailer';
import { brotliDecompressSync } from 'zlib';


export default() => {

  //create transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bolivarcyclingtest@gmail.com",
      pass: "udem gsyv okur orvl"
          
    },
  });

    

  return {
    sendSuggestion: ({body, set}) =>
    { 

    // mail options 
    const mailOptions = {
      from: 'bolivarcyclingtest@gmail.com',
      to: 'bolivarcyclingtest@gmail.com',
      subject: 'New Route Suggestion from Bolivar Cycling Website!',    
      attachments: [{
          filename: body.name + '.gpx',
          content: body.route
      }],
      text: 'A new route has been submitted for your review! \n Name of route: ' + body.name

  };
      transporter.sendMail(mailOptions);
    }
  };
}

 






 


  

