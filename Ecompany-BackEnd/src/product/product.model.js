'use strict'

const { default: mongoose } = require("mongoose")

const productSchema = mongoose.Schema({
   name: {
        type: String,
    required: true
   },
   description: {
    type: String,
    required: true
   },
   price: {
    type: Number,
    required: true
   },
   stock:{
    type: Number,
    required: true
   },
   sales: {
    type: Number,
    default: 0
   },
   image: {
    type: String,
    required: true
   },
   category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie',
    required: true
   } 
},{
    versionKey: false
})

module.exports = mongoose.model('Product', productSchema)