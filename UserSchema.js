const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    googleID: String,
    username: String,
    password: String
});

module.exports = new mongoose.model("Users", userSchema);