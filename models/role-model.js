const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    required: true,
    type: String,
    unique: true,
  },
  status: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("role", roleSchema);
