import nodemailer from 'nodemailer';
import { config } from 'vue-email/compiler';


// create transporter 
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "bolivarcyclingtest@gmail.com",
      pass: "udem gsyv okur orvl",     
    },
  });

  // mail options 
  const mailOptions = {
    from: 'bolivarcyclingtest@gmail.com',
    to: 'bolivarcyclingtest@gmail.com',
    subject: 'GPX File and Text Submission',
    text: text,
    attachments: [{
        filename: 'gpx-file.gpx',
        content: gpxFile,
    }],
};

export async function sendMail(req)
{ 
  const { gpxFile, text } = req.body;
  try {
    await transporter.sendMail(mailOptions);
    return new Response('Email sent successfully!', { status: 200 });
} catch (error) {
    console.error('Error sending email:', error);
    return new Response('Failed to send email.', { status: 500 });
}
});
};