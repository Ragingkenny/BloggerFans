//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require("lodash");
const passport = require("passport");
var LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const bcrypt = require("bcrypt");



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://holtk29:Test-123@cluster0.2q1l8tr.mongodb.net/blogDB");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = new mongoose.model("Post", blogSchema);

let posts = [];

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/userhome", function (req, res) {
  Post.find({}, function (err, foundBlog) {
    res.render("userhome", { newContent: homeStartingContent, allPosts: foundBlog });
  });
})

app.get("/about", function (req, res) {
  res.render("about", { newContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { newContact: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  let newPost = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  const newBlog = new Post({ title: req.body.postTitle, content: req.body.postBody });
  newBlog.save();

  posts.push(newPost);
  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {

  Post.find({}, function (err, foundBlogs) {
    foundBlogs.forEach(function (post) {
      let requestedTitle = _.lowerCase(req.params.postId);
      let postTitle = _.lowerCase(post.title)
      if (postTitle === requestedTitle) {
        res.render("post", { title: requestedTitle, content: post.content })
        console.log(postTitle + " & " + requestedTitle + " is a match!");
      }
      console.log(post.title);
    });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
