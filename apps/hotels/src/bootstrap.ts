import TelegramApi from 'node-telegram-bot-api';
import nodemailer from 'nodemailer';
import {env} from "process";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: env['MAIL_LOGIN'],
    pass: env['MAIL_PASSWORD'],
  },
})

export const dbConnect = (url: string) => {
  // mongoose
  //   .connect(url, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   })
  //   .then(() => {
  //     console.log('Connected to database');
  //   })
  //   .catch((err) => {
  //     console.log('Failed to connect to database', err);
  //   });
};

// Create a bot that uses 'polling' to fetch new updates
export const createBot = (token: string): TelegramApi =>
  new TelegramApi(token, { polling: true });
