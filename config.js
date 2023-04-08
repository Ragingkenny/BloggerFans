const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const googleStrategy = require("./Strategies/googleStrategy");

module.exports = function (app, dbConnectionString, sessionSecret) {
  app.set('view engine', 'ejs');

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.set('trust proxy', 1);
  app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    //cookie: { secure: true }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  mongoose.connect(dbConnectionString);

  const blogSchema = require("./blogSchema");
  const Post = new mongoose.model("Post", blogSchema);

  const Users = require("./UserSchema");
  googleStrategy(passport, Users);

  passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, {
        id: user.id,
        username: user.username,
        picture: user.picture
      });
    });
  });

  passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
      return cb(null, user);
    });
  });

  return Post;
}