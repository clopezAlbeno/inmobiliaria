"use strict";

const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    card: {
      numberCard: Number,
      keyCard: Number,
      dateCard: String
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    user: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      name: String,
      surname: String,
      email: String,
      phone: String,
    },
    products: [
      {
        product: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
          },
          name: String,
          description: String,
          price: Number,
          image: String,
          quantity: Number,
          subTotal: Number,
          category: {
            name: String,
            description: String
          }
        }
      },
    ],
    state: String
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Bill", billSchema);
