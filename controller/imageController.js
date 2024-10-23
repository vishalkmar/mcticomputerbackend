const multer = require("multer");
const path = require('path');
const Inquiry = require("../model/inquarymodel"); // Import the student model (Inquiry)
const Image = require("../model/Image"); // Import the image model

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Ensure this path is correct
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image'); // Ensure 'image' matches the field name from the frontend

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Handle image upload and update student's record using email
// To handle file paths

const uploadImage = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (req.file === undefined) {
      return res.status(400).json({ error: 'No file selected' });
    }

    console.log("Received email:", req.body.email);
    console.log("Received file:", req.file);

    const email = req.body.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Save only the relative path, e.g., "uploads/filename.jpg"
      const relativePath = `http://localhost:8000/uploads/${req.file.filename}`;

      // Create a new image entry in the Image model
      const newImage = await Image.create({
        filename: req.file.filename,
        path: relativePath // Save only the relative path
      });

      console.log("New Image Entry Created:", newImage);

      // Find the student by email and update the certificate path
      const updatedStudent = await Inquiry.findOneAndUpdate(
        { email: email },
        { certificatePath: relativePath },  // Save the relative path to certificate
        { new: true }
      );
      
      if (!updatedStudent) {
        return res.status(404).json({ error: 'Student not found' });
      }

      console.log("Updated Student Record:", updatedStudent);

      res.status(200).json({
        message: 'Certificate uploaded and student record updated!',
        student: updatedStudent,
        image: newImage
      });

    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error', err });
    }
  });
};

module.exports = uploadImage