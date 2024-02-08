const express = require("express");
const Role = require("../models/role-model");

const router = express.Router();

//Post Method
router.post("/create", async (req, res) => {
  try {
    const oldRole = await Role.findOne({ role_name: req.body.role_name });

    if (oldRole) {
      return res.status(409).json({
        code: 409,
        message: "Role Already Exist.",
      });
    } else {
      const newRole = new Role({
        role_name: req.body.role_name,
        status: req.body.status,
      });
      const userToSave = newRole.save();
      res.status(200).json({
        code: 200,
        message: "Role created successfully!",
      });
    }
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

module.exports = router;
