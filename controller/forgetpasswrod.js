const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Inquiry = require('../model/inquarymodel'); // Adjust the path as necessary
const dotenv = require("dotenv");
dotenv.config();

// Function to send email
const sendEmail = async (email, newPassword) => {
  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail is used here; replace if you're using another email service
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail email (defined in .env)
      pass: process.env.EMAIL_PASS, // Your Gmail password or app-specific password (defined in .env)
    }
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your email
    to: email, // Recipient's email
    subject: 'Your New Password',
    text: `Your new password is: ${newPassword}`
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email not sent'); // This will trigger the catch block in forgetPassword
  }
};

// The forgetPassword function
const forgetPassword = async (req, res) => {
  try {
    // Check if the user exists
    const user = await Inquiry.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "We did not find any user with this email" });
    }

    // Generate a random new password
    const newPassword = Math.random().toString(36).slice(-8);
    console.log("Generated password: ", newPassword);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await Inquiry.findOneAndUpdate(
      { email: req.body.email }, // Find the user by email
      { password: hashedPassword } // Update the password field with hashed password
    );

    // Send the new password to the user's email
    await sendEmail(user.email, newPassword);

    // Send a success response
    res.status(200).json({ message: "A new password has been sent to your email." });

  } catch (error) {
    console.error('Error in forgetPassword:', error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

module.exports = forgetPassword;
