'use strict'

const mongoose = require ('mongoose');

const cartSchema = mongoose.Schema ({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity:{
                type: Number,
                defult: 1,
                min: 1
            },
            subTotal: Number
        }
    ],
    total: Number
},
{
    versionKey: false
});

module.exports=mongoose.model("Cart",cartSchema);