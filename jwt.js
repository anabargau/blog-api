require('dotenv');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Users = require('./models/user');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  Users.findOne({ username: jwt_payload.username }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    bcrypt.compare(jwt_payload.password, user.password, (err, result) => {
      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    });
  });
});
