// controller/inquiryController.js

const nodemailer = require("nodemailer");
const Inquiry = require("../model/inquarymodel"); // Check this path
const bcrypt = require("bcrypt");
const dotenv = require("dotenv")
dotenv.config(); // Load environment variables from .env file


const registerUser = async (req, res) => {
  try {
      const { name, fatherName, dob, address, city, state, pinCode, email, phone, timing, course } = req.body;

      const username = `${name.split(' ')[0]}${Math.floor(Math.random() * 1000)}`;
      const password = Math.random().toString(36).slice(-8); // random 8-character password

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Configure nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER, // Use the environment variable
            pass: process.env.EMAIL_PASS, // Use the environment variable
        },
    });

      // Mail options
      const mailOptions = {
          from: email, // sender's email (from request body)
          to: process.env.MY_EMAIL, // receiver's email
          subject: `Regarding this: ${course} course`, // email subject
          html: `
              <p>You have successfully enrolled in our ${course}. Please keep your username and password safe and secure for future references. You will only be able to show and download your course completion certificate using this username and password.</p>
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Password:</strong> ${password}</p>
          `, // HTML email body
      };

      // Check if the email already exists
      try {
          const validmail = await Inquiry.findOne({ email: req.body.email });
          if (validmail) {
              return res.status(400).json({ message: "Email already exists" });
          } else {
              const info = await transporter.sendMail(mailOptions);
              if (info.response) {
                  // Parse the dob correctly (assuming the input format is "dd/mm/yyyy")
                  const dobParts = dob.split('/');
                  if (dobParts.length === 3) {
                      const dobDate = new Date(`${dobParts[2]}-${dobParts[1]}-${dobParts[0]}`);
                      
                      if (isNaN(dobDate.getTime())) {
                          return res.status(400).json({ message: "Invalid date format for DOB" });
                      }
                      
                      const newuser = new Inquiry({
                          name: name,
                          email: email,
                          phone: phone,
                          fatherName: fatherName,
                          dob: dobDate,
                          address: address,
                          city: city,
                          state: state,
                          pinCode: pinCode,
                          timing: timing,
                          course: course,
                          username: username,
                          password: hashedPassword,
                      });

                      await newuser.save(); // Save the user to the database
                      console.log("Email sent: " + info.response);
                      return res.status(200).json({ message: "Email sent successfully, and user registered." });
                  } else {
                      return res.status(400).json({ message: "Invalid DOB format. Please use 'dd/mm/yyyy'." });
                  }
              }
          }
      } catch (mailError) {
          console.error("Error sending email:", mailError);
          return res.status(500).json({ message: "Error sending email" });
      }
  } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Server error" });
  }
};


 
// this si the route to send the information to the user who is request to data 
const getUserData = async (req, res) => {
  try {
    // Exclude password and username fields from the query result
    const users = await Inquiry.find().select('-password -username');

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the users without password and username fields
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json({ message: "Error retrieving user data", error });
  }
};




// this is for upload iimage for the specific user
const getUserOne = async (req, res) => {
  try {
    const email = req.body.email; // Get the email from the request body
    console.log("Received email:", email); // Log the received email

    // Ensure the email is being sent and is valid
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const users = await Inquiry.find({ email: email });
    console.log("Users found:", users); // Log the found users

    // Check if any users were found
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the users without password and username fields
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return res.status(500).json({ message: "Error retrieving user data", error });
  }
};



  


// this is the function to delete the user form the frontend

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
       console.log(userId) // Debugging: Log user ID
  
      // Check if the user exists and delete
      const deletedUser = await Inquiry.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        // If user is not found
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      // Success case
      console.log("User deleted successfully");
      return res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
      // Error handling
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Error deleting user", error });
    }
  };

 
  const loginUser = async(req, res) => {
    try {
      const { username, password } = req.body;
  
      // Find user by username
      const user = await Inquiry.findOne({ username });
      
      if (!user) {
        return res.status(404).json({ message: "Username is wrong" });
      }
  
      // Compare password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Password is incorrect" });
      }
  
      // Remove password field before sending the response
      const { password: _, ...userWithoutPassword } = user.toObject();
  
      // Respond with all user data except password
      res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword
      });
  
    } catch (error) {
      return res.status(500).json({ message: "Error in finding user", error });
    }
  };
  

  
  
  
  module.exports = {registerUser,getUserData , deleteUser,loginUser,getUserOne};

 