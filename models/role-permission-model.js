const mongoose = require("mongoose");

const rolePermissionSchema = new mongoose.Schema({
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "role",
  },
  permission_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "permission",
  },
});

module.exports = mongoose.model("role_permission", rolePermissionSchema);
