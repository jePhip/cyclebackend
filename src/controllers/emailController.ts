import nodemailer from "nodemailer";
import { brotliDecompressSync } from "zlib";

export default () => {
  //create transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bolivarcyclingtest@gmail.com",
      pass: "",
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
          "A new route has been submitted for your review! \nName of route: " +
          body.name + "\nPoints of interest: " + body.poi + "\nContact email: " + body.email,
      };
      transporter.sendMail(mailOptions);
      set.status = 200;
      return new Response(JSON.stringify({ message: "success!" }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
};
