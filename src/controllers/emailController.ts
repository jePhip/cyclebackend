import nodemailer from "nodemailer";
import { brotliDecompressSync } from "zlib";

export default () => {
  //create transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
  });


  return {
    sendSuggestion: ({ body, set }) => {
      // mail options
      const mailOptions = {
        from: "bolivarcyclingtest@gmail.com",
        to: "bolivarcyclingtest@gmail.com",
        subject: "New Route Suggestion from Bolivar Cycling Website!",
        attachments: [
          {
            filename: body.name + ".gpx",
            content: body.file,
          },
        ],
        text:
          "A new route has been submitted for your review! \n Name of route: " +
          body.name,
      };
      transporter.sendMail(mailOptions);
      set.status = 200;
      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
};
