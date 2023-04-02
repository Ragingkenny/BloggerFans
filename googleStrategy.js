const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = function (passport, Users) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets"
    },
        function (accessToken, refreshToken, profile, cb) {
            Users.findOne({ googleID: profile.id }).then(user => {
                if (!user) {
                    const newUser = new Users({ googleID: profile.id });
                    return newUser.save();
                }
                else {
                    return user;
                }
            })
                .then((user) => {
                    return cb(null, user);
                })
                .catch((err) => {
                    return cb(err);
                })
        }
    ));

}

