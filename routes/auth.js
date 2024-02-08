const express = require("express");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Role = require("../models/role-model");
const RolePermission = require("../models/role-permission-model");
const { verifyRefresh } = require("../helper/helper");
//const middleware = require("../middleware/auth");

const router = express.Router();

//Post Method
router.post("admin/register", async (req, res) => {
  try {
    const oldUser = await User.findOne({ email: req.body.email });

    if (oldUser) {
      return res.status(409).json({
        code: 409,
        message: "User Already Exist. Please Login",
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
        message: "User registered successfully!",
      });
    }
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({
        code: 400,
        message: "All input is required",
      });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      RolePermission.aggregate([
        {
          $match: { role_id: user.role_id },
        },
        {
          $lookup: {
            from: "permissions",
            localField: "permission_id",
            foreignField: "_id",
            as: "permission",
          },
        },
        {
          $unwind: "$permission",
        },
        {
          $project: {
            permission_id: 1,
            permission: "$permission.permission_name",
          },
        },
      ]).then((rolePermissions, err) => {
        if (err) {
          res.status(500).json({
            code: 500,
            message: "Something went wrong: " + err,
          });
        } else {
          const token = jwt.sign({ user_id: user._id, email }, "secret_key", {
            expiresIn: 60 * 60,
          });

          const refreshToken = jwt.sign(
            { user_id: user._id, email },
            "refresh_secret",
            {
              expiresIn: "3d",
            }
          );
          // save user token
          user.token = token;

          // user
          res.status(200).json({
            code: 200,
            message: "Logged in successfully",
            data: {
              user: user,
              accessToken: token,
              refreshToken: refreshToken,
              permissions: rolePermissions,
            },
          });
        }
      });

      // Create token
    } else {
      res.status(400).json({
        code: 400,
        message: "Invalid Credentials",
      });
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/user-exist", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      res.status(400).json({
        code: 400,
        message: "Something went wrong!",
      });
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    if (user) {
      if (user.role_id == "63c6917642c4fd106d7599b5") {
        // user
        res.status(200).json({
          code: 200,
          message: "User exist",
        });
      } else {
        res.status(404).json({
          code: 404,
          message: "User not found",
        });
      }
    } else {
      res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/reset-password", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email } = req.body;

    // Validate user input
    if (!email) {
      res.status(400).json({
        code: 400,
        message: "Something went wrong!",
      });
    }

    // Validate if user exist in our database
    const user = await User.findOne({ email });
    console.log("User exist?", user);
    if (user) {
      if (user.role_id == "63c6917642c4fd106d7599b5") {
        encryptedPassword = await bcrypt.hash(req.body.password, 10);
        // user
        User.updateOne(
          { email: email },
          {
            $set: {
              password: encryptedPassword,
            },
          }
        ).then((user) => {
          if (!user) {
            return res.status(404).json({
              code: 404,
              message: "User not found!",
            });
          }
          res.json({
            status: 200,
            message: "Password resetted successfully!",
          });
        });
      } else {
        res.status(404).json({
          code: 404,
          message: "User not found",
        });
      }
    } else {
      res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/signup", async (req, res) => {
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
        message: "Your account has created successfully!",
        //category: categoryToSave
      });
    }
  } catch (error) {
    res.status(400).json({ code: 200, message: error.message });
  }
});

router.post("/admin/login", async (req, res) => {
  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json({
        code: 400,
        message: "All input is required",
      });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.role_id == "63c6911c2ed75eba5d72c924") {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json({
          code: 200,
          message: "Logged in successfully",
          data: {
            user: user,
            token: token,
          },
        });
      } else {
        res.status(404).json({
          code: 404,
          message: "User not found!",
        });
      }
      // Role.findOne({ _id: user.role_id }).then((role) => {

      // }).catch((error) => {
      //   res.status(500).
      //   json({
      //     code: 500,
      //     message: "Something went wrong!",
      //   });
      // });
    }
    res.status(400).json({
      code: 400,
      message: "Invalid Credentials",
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

async function isAdmin(id) {
  Role.findOne({ _id: id })
    .then((role) => {
      if (role.role == "admin") {
        console.log("hey 2");
        return true;
      }
    })
    .catch((error) => {
      return false;
    });
}

router.post("/refresh-token", (req, res) => {
  const { user_id, email, refreshToken } = req.body;
  const isValid = verifyRefresh(email, refreshToken);
  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }
  const token = jwt.sign({ user_id: user_id, email }, "secret_key", {
    expiresIn: 60,
  });
  return res.status(200).json({
    code: 200,
    message: "Refresh token successfully!",
    data: { accessToken: token },
  });
});

module.exports = router;
