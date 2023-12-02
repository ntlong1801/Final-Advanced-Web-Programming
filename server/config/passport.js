const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const db = require("./connect_db");

// Passport serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  db.one('SELECT * FROM user WHERE email = $1', email)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

// Google authentication strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
    console.log(profile);
  const user = {
    id: profile.id, // this is the ID google gave us when login with passport, it's different from the id we store in database => so we should use it as password :>
    email: profile.emails[0].value,
    fullName: profile.displayName,
  };

  // Check if the user exists in the database, if not, add them
  db.oneOrNone('SELECT * FROM user WHERE email = $1', user.email)
    .then(existingUser => {
      if (existingUser) {
        return done(null, existingUser);
      } else {
        return db.one(
          'INSERT INTO user (email, password, fullName) VALUES ($1, $2, $3) RETURNING *',
          [user.email, user.id, user.fullName]
        ).then(newUser => done(null, newUser));
      }
    })
    .catch(err => done(err, null));
}));

module.exports = passport;
