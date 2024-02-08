// Passport JWT Strategy Configuration
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret_key",
};

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findById(jwt_payload.user_id).then((user, err) => {
      console.log("Comes here jas");
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

// Route Middleware to Secure Routes
// const requireAuth = passport.authenticate("jwt", { session: false });

// module.exports = { requireAuth };
