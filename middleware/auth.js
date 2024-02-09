// // Passport JWT Strategy Configuration
// const passport = require("passport");
// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: "secret_key",
// };

// passport.use(
//   new JwtStrategy(opts, function (jwt_payload, done) {
//     User.findById(jwt_payload.user_id).then((user, err) => {
//       console.log("Comes here jas");
//       if (err) {
//         return done(err, false);
//       }
//       if (user) {
//         return done(null, user);
//       } else {
//         return done(null, false);
//       }
//     });
//   })
// );

// //Route Middleware to Secure Routes
// const requireAuth = passport.authenticate("jwt", { session: false });

// module.exports = { requireAuth };

const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({
      status: 403,
      message: "Data forbidden!",
    });
  }
  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
