const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  role_id: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  password: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
    unique: true,
  },
  status: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
