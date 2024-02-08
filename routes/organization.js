const express = require("express");
const Organization = require("../models/organization-model");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/auth");

const router = express.Router();

//Post Method
router.post("/create", async (req, res) => {
  try {
    const oldUser = await Organization.findOne({
      registration_id: req.body.registration_id,
    });

    if (oldUser) {
      return res.status(409).json({
        code: 409,
        message: "Organization Already Exist.",
      });
    } else {
      const newOrganization = new Organization({
        organization_name: req.body.organization_name,
        registration_id: req.body.registration_id,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        size: req.body.size,
        status: req.body.status,
      });
      const organizationToSave = newOrganization.save();
      res.status(200).json({
        code: 200,
        message: "Organization created successfully!",
      });
    }
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

//Get all Method
router.get("/getAll", (req, res) => {
  let organizations = Organization.find({}).then((organizations, err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    } else {
      res.json({
        status: 200,
        message: "All organizations retrieved successfully!",
        data: organizations,
      });
    }
  });
});

//Get by ID Method
router.get("/getOne/:id", (req, res) => {
  Organization.findOne({ _id: req.params.id })
    .then((organization) => {
      if (!organization) {
        return res.status(404).json({
          status: 404,
          message: "User not found!",
        });
      }
      res.json({
        status: 200,
        message: "Organization data retrieved successfully!",
        data: organization,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  Organization.updateOne(
    { _id: req.params.id },
    {
      $set: {
        organization_name: req.body.organization_name,
        registration_id: req.body.registration_id,
        email: req.body.email,
        phone: req.body.phone,
        location: req.body.location,
        size: req.body.size,
        status: req.body.status,
      },
    }
  )
    .then((organization) => {
      if (!organization) {
        return res.status(404).json({
          status: 404,
          message: "Organization not found!",
        });
      }
      res.json({
        status: 200,
        message: "Organization data updated successfully!",
        data: organization,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  Organization.deleteOne({ _id: req.params.id })
    .then((organization) => {
      if (!organization) {
        return res.status(404).json({
          status: 404,
          message: "Organization not found!",
        });
      }
      res.send({
        status: 200,
        message: "Organization deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
