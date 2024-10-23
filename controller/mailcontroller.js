// const { Mailmodel } = require("../model/mailmodel");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv")
dotenv.config() // loading files

const sendmail = async (req, res) => {
  const { name, email, message,phone,subject } = req.body; // 'message' destructured

  try {
//     const emailuser = new Mailmodel({
//       name: name,
//       email: email,
//       message: message,
//       phone:phone,
//       subject:subject

//     });

    // await emailuser.save(); // Save email details in the database

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port:465,
      secure: true,
      auth: {
        user:process.env.EMAIL_USER , // Gmail email from environment variable
        pass:process.env.EMAIL_PASS, // Gmail app password from environment variable
      },
    });

    // Mail options
    const mailOptions = {
      from: email, // sender's email (from request body)
      to: process.env.MY_EMAIL, // receiver's email
      subject: subject, // email subject
      html: `
      <p><strong>Name:</strong> ${name}</p>
        <p><strong>User Message:</strong> ${message}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
      `, // HTML email body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};


// thi is enrollment form mail route


const sendEnrollEmail = async (req, res) => {
  const { name, email, phone, course } = req.body; // 'message' destructured

  try {
//     const emailuser = new Mailmodel({
//       name: name,
//       email: email,
//       message: message,
//       phone:phone,
//       subject:subject

//     });

    // await emailuser.save(); // Save email details in the database

    // Configure nodemailer transporter
    const transportertwo = nodemailer.createTransport({
      service: 'gmail',
      port:465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER, // Gmail email from environment variable
        pass: process.env.EMAIL_PASS, // Gmail app password from environment variable
      },
    });

    // Mail options
    const mailOptionstwo = {
      from: email, // sender's email (from request body)
      to: process.env.MY_EMAIL, // receiver's email
      subject: "Regarding Course Admission", // email subject
      html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
        <p><strong>Enrollment Regarding This Course:</strong> ${course}</p>
      `, // HTML email body
    };

    // Send email
    const info = await transportertwo.sendMail(mailOptionstwo);
    console.log("Email sent: " + info.response);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {sendEnrollEmail,sendmail};
