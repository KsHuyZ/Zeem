const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User.js')

passport.serializeUser((user,done)=>{
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    // User.findById(id,(err,user)=>{
        done(null,user)
    // })
})
// passport.deserializeUser(function(obj, done) {
//     done(null, false);  // invalidates the existing login session.
//   });
passport.use(new GoogleStrategy({
    clientID: "61028295198-u76d8h2hhs3q81msfkudc6hepcvn9i4m.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://mysterious-spire-07069.herokuapp.com/login/google/callback"
  },
  function( accessToken, refreshToken, profile, done) {
      // use the profile infor (mainly profile id) if the user is register in ur db
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      // console.log(accessToken)
      return done(null, profile);
    // });
  }
));