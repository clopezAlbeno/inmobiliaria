"use strict";

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String, 
    required: true
  },
  photo: String,
  rol: {
    type: String,
    upperCase: true,
    required: true
  },
});

module.exports = mongoose.model("User", userSchema);