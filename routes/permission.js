const express = require("express");
const Permission = require("../models/permission-model");

const router = express.Router();

//Post Method
router.post("/create", async (req, res) => {
  try {
    const oldPermission = await Permission.findOne({
      permission_name: req.body.permission_name,
    });

    if (oldPermission) {
      return res.status(409).json({
        code: 409,
        message: "Permission Already Exist.",
      });
    } else {
      const newPermission = new Permission({
        permission_name: req.body.permission_name,
        permission_label: req.body.permission_label,
        permission_type: req.body.permission_type,
      });
      const permissionToSave = newPermission.save();
      res.status(200).json({
        code: 200,
        message: "Permission created successfully!",
      });
    }
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

module.exports = router;
