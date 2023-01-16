const nodemailer = require("nodemailer");
//create transporter
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: Number(process.env.SMTP_PORT) || 25,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async (emailTo, subject, text, html, file) => {
  try {
    let defaultmailOption = {
      from: "no-reply@jpg.com",
      to: emailTo,
      subject: subject,
      text: text,
      html: html,
    };
    let mailOption = {};
    if (file) {
      mailOption = {
        ...defaultmailOption,
        attachments: [
          {
            filename: "receipt",
            path: file,
          },
        ],
      };
    } else {
      mailOption = {
        ...defaultmailOption,
      };
    }
    //console.log(mailOption);
    let resp = await transporter.sendMail(mailOption);
    console.log(resp);
  } catch (err) {
    console.log(err);
  }
};
