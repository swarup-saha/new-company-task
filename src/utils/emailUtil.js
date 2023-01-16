// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const sendMail = (email, text) => {
//   const msg = {
//     to: email,
//     from: "swarupsaha340@gmail.com",
//     subject: "Sending with SendGrid is Fun",
//     text: `through your email and this password ${text} sign in`,
//     html: `<h1>Enter the following OTP on the website to change password:</h1><br/>
//       <h2><strong>${text}</strong></h2>tml`,
//   };

//   sgMail
//     .send(msg)
//     .then((response) => {
//       console.log("email got response");
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

//batchSend.js
var SibApiV3Sdk = require("sib-api-v3-sdk");
SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
  process.env.SENDGRID_API_KEY;
const sendMail = (email, password) => {
  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      sender: { email: "noreply@swarup.com", name: "swarup" },
      subject: "credentials",
      htmlContent: `<!DOCTYPE html><html><body><p>You can sign in by this gmail ${email} along with this password ${password} </p></body></html>`,
      messageVersions: [
        {
          to: [
            {
              email: email,
            },
          ],
        },
      ],
    })
    .then(
      function (data) {
        console.log(data);
      },
      function (error) {
        console.error(error);
      }
    );
};

module.exports = {
  sendMail,
};
