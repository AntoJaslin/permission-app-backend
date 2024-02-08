const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  organization_name: {
    required: true,
    type: String,
  },
  registration_id: {
    required: true,
    type: String,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  phone: {
    required: true,
    type: String,
    unique: true,
  },
  location: {
    required: true,
    type: String,
  },
  size: {
    required: false,
    type: Number,
  },
  status: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("organization", userSchema);
