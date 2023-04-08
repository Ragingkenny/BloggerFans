const passport = require("passport");
const LocalStrategy = require('passport-local');

module.exports = function (passport, Users) {
    passport.use(new LocalStrategy(
        function verify(username, password, done) {
            Users.findOne({ username: username }).then((user) => {
                if (!user) {
                    return done(null, false, { message: "User with that email does not exist" });
                }
                else {
                    console.log("hashed pass: " + user.password);
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result === true) {
                            console.log("it's a match!");
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: "Incorect password or username" });
                        }

                    });
                }
            })
                .catch((err) => {
                    console.log("you've got a problem!");
                    return done(null, err);
                });

        }));

}