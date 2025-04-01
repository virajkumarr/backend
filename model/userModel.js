const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    mobile: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;
