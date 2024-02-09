const express = require("express");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/auth");
//const { requireAuth } = require("../middleware/auth");
//const passport = require("passport");
const { faker } = require("@faker-js/faker");

const router = express.Router();

//Post Method
router.post("/create", async (req, res) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.status(409).json({
        code: 409,
        message: "User Already Exist.",
      });
    } else {
      encryptedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        role_id: req.body.role_id,
        email: req.body.email,
        password: encryptedPassword,
        phone: req.body.phone,
        status: req.body.status,
      });
      const userToSave = newUser.save();
      res.status(200).json({
        code: 200,
        message: "User created successfully!",
      });
    }
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

//Generate fake users
router.get("/generate-users", (req, res) => {
  const user = generateUsers(50);
  User.insertMany(user)
    .then((docs) =>
      console.log(`${docs.length} users have been inserted into the database.`)
    )
    .catch((err) => {
      console.error(err);
      console.error(
        `${
          err.writeErrors?.length ?? 0
        } errors occurred during the insertMany operation.`
      );
    });
});

//Get all Method
router.get("/getAll", middleware, (req, res) => {
  let users = User.find({}).then((users, err) => {
    if (err) {
      res.status(400).json({ message: err.message });
    } else {
      res.json({
        status: 200,
        message: "All users retrieved successfully!",
        data: users,
      });
    }
  });
});

//Get by ID Method
router.get("/getOne/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found!",
        });
      }
      res.json({
        status: 200,
        message: "User data retrieved successfully!",
        data: user,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        role_id: req.body.role_id,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
      },
    }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found!",
        });
      }
      res.json({
        status: 200,
        message: "User data updated successfully!",
        data: user,
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//Delete by ID Method
router.delete("/delete/:id", (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found!",
        });
      }
      res.send({
        status: 200,
        message: "User deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

const generateUsers = (num) => {
  const user = [];

  for (let i = 0; i < num; i++) {
    const name = faker.name.firstName();
    const role_id = "65c3b67da6e6a0607d66a0d6";
    const email = faker.internet.email();
    const phone = faker.datatype.number();
    const password = faker.datatype.number();
    const status = "active";

    user.push({
      name,
      role_id,
      email,
      phone,
      password,
      status,
    });
  }

  return user;
};

module.exports = router;
