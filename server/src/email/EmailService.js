const nodemailer = require("nodemailer");
const transporter = require("../config/emailTransporter");
const config = require("config");

const sendOTP = async (email, otp) => {
  const info = await transporter.sendMail({
    ...config.get("mailConfig"),
    to: email,
    subject: "OTP code",
    text: "VPASS OTP",
    html: `
    <div>
      <h>Your OTP code</h>
    </div>
    <div>
      Code is ${otp}
    </div>
`,
  });
  if (process.env.NODE_ENV === "development") {
    console.log("url: " + nodemailer.getTestMessageUrl(info));
  }
};

module.exports = { sendOTP };
