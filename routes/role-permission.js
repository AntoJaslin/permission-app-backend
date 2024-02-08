const express = require("express");
const RolePermission = require("../models/role-permission-model");

const router = express.Router();

//Post Method
router.post("/create", async (req, res) => {
  try {
    const newRolePermission = new RolePermission({
      role_id: req.body.role_id,
      permission_id: req.body.permission_id,
    });
    const permissionToSave = newRolePermission.save();
    res.status(200).json({
      code: 200,
      message: "Role Permission created successfully!",
    });
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

module.exports = router;
