const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  permission_name: {
    required: true,
    type: String,
    unique: true,
  },
  permission_label: {
    required: true,
    type: String,
  },
  permission_type: {
    required: true,
    type: String,
    enum: ["MODULE", "ACTION"],
  },
});

module.exports = mongoose.model("permission", permissionSchema);
