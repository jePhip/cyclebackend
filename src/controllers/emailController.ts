import nodemailer from 'nodemailer';
import { config } from 'vue-email/compiler';

const nodemailer = require("nodemailer");


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