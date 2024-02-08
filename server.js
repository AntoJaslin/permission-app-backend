require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoString = "mongodb://localhost:27017/role-permission-app";
const bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
const passport = require("passport");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const organizationRoutes = require("./routes/organization");
const roleRoutes = require("./routes/role");
const permissionRoutes = require("./routes/permission");
const rolePermissionRoutes = require("./routes/role-permission");

const User = require("./models/user-model");

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
var dir = path.join(__dirname, "public");

app.use(express.static(dir));
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(passport.initialize()); // Initialize Passport middleware

// Passport JWT Strategy Configuration
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret_key",
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.user_id).then((user, err) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        console.log("Comes here jas");
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

// Route Middleware to Secure Routes
const requireAuth = passport.authenticate("jwt", { session: false });

// // Apply Passport middleware to secure routes
// app.use("/api/user", requireAuth);
// app.use("/api/organization", requireAuth);
// app.use("/api/role", requireAuth);
// app.use("/api/permission", requireAuth);
// app.use("/api/role-permission", requireAuth);

//admin apis
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/permission", permissionRoutes);
app.use("/api/role-permission", rolePermissionRoutes);

app.get("/api/protected", requireAuth, (req, res) => {
  console.log("Comes here jas");
  res.json({ message: "Protected Route Accessed Successfully" });
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
