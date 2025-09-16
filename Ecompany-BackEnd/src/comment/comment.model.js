"use strict";

const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      hour: {
        type: String,
        required: true,
      },
      approve: {
        type: Boolean,
        required: true,
      }
    }
  ]
});

module.exports = mongoose.model("Comment", commentSchema);
