// require('dotenv').config();
import nodemailer from "nodemailer";
import googleapis from "googleapis";
import { } from "dotenv/config";

const { google } = googleapis;
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  // const accessToken = oauth2Client
  //   .getAccessToken()
  //   .then((res) => {
  //     console.log(res);
  //     return res.credentials.access_token;
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log(err);
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  console.log(accessToken);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GOOGLE_EMAIL,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

export const sendEmail = async (emailOptions) => {
  // console.log(process.env.REDIRECT_URI);
  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};

//   sendEmail({
//     subject: "Test",
//     text: "I am sending an email from nodemailer!",
//     to: "put_email_of_the_recipient",
//     from: process.env.EMAIL
//   });
