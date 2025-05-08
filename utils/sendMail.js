const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

const sendMail = (props) => {
  const { receiverMail, mailSubject, fullName, content, isForOtp, otp } = props;
  try {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SENDER_MAIL,
        pass: process.env.SENDER_PASS,
      },
    });

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("./utils"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./utils"),
    };

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    var mailOptions = {
      from: process.env.SENDER_MAIL,
      to: receiverMail,
      subject: mailSubject,
      template: "email", // the name of the template file i.e email.handlebars
      // text:content,
      context: {
        name: fullName, // replace {{name}} with Adebola
        verificationLink: content,
      },
    };

    var otpMailOptions = {
      from: process.env.SENDER_MAIL,
      to: receiverMail,
      subject: mailSubject,
      template: "otp", // the name of the template file i.e email.handlebars
      // text:content,
      context: {
        otp: otp,
      },
    };

    transporter.sendMail(
      isForOtp ? otpMailOptions : mailOptions,
      function (error, info) {
        if (error) {
          console.log(error, "mail error");
          return error;
        } else {
          return info.response;
        }
      }
    );
  } catch (error) {
    console.log(error, "catch mail error");
  }
};

module.exports = sendMail;
