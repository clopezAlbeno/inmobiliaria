'use strict'

const express = require('express');
const app = express();
const helmet = require('helmet');
const categoryRoutes = require ('../src/category/category.routes')
const userRoutes = require('../src/user/user.routes')
const productRoutes = require('../src/product/product.routes')
const cartRoutes = require('../src/cart/cart.routes')
const userController = require('../src/user/user.controller');
const categoryController = require('../src/category/category.controller')
const productController = require('../src/product/product.controller')
const commentRoutes = require('../src/comment/comment.routes')
const billRoutes = require('../src/bill/bill.routes');
const mapController = require('../src/map/map.controller')
const mapRoutes = require('../src/map/map.routes')
const morgan = require('morgan');
const cors = require('cors');
const port = process.env.PORT || 3300;

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/category', categoryRoutes)
app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/cart', cartRoutes)
app.use('/comment', commentRoutes)
app.use('/bill', billRoutes)
app.use('/map', mapRoutes)

const funtionsDefault = async(req, res)=>{
    try {
        await userController.createAdminDefault();
        await userController.createDeletedAccount();
        await categoryController.defaultCategory();
        await productController.createDeletedProduct()
        await mapController.addDefaultPin();
    } catch (err) {
        console.log(err);
    }
}
exports.initServer = ()=>{
    app.listen(port);
    funtionsDefault();
    console.log(`Server http running in port ${port}`);
}