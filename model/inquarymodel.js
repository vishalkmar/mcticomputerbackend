const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  timing: { type: String, required: true },
  course: { type: String, required: true },
  username: { type: String },
  password: { type: String },
  certificatePath: { type: String }, // Add this field to store the image path
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
