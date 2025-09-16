'use strict'

const Product = require('../product/product.model');
const Category = require('../category/category.model');
const User = require('../user/user.model');
const {validateData} = require('../utils/validate.js')
const path = require('path');
const fs = require('fs');
const Cart = require('../cart/cart.model')
const Bill = require('../bill/bill.model')

exports.test = async(req, res)=>{
    return res.send({message: 'test is running'})
}

exports.createDeletedProduct = async (req, res) => {
    try {
      let deletedProduct = {
        name: 'Deleted',
        description: 'Product',
        price: 0,
        stock: 0,
        sales: 0,
        image: 'ProductDeleted.jpg'
      }
      let category = await Category.findOne({name: 'Default', description: 'Category default'});
      let product = await Product.findOne({name: 'Deleted', description: 'Product'});
      if(product) return console.log('Deleted Product already exists')
      deletedProduct.category = category._id;
      let newProduct = new Product(deletedProduct)
      await newProduct.save()
      return console.log('Deleted Product was created')
    } catch (err) {
        console.log(err);
      return console.log('Error creating Deleted Product');
    }
  }

exports.addProduct = async(req, res)=>{
    try{
        let data = req.body
        // Validar que la categoria exista
        let categoryExist = await Category.findOne({_id: data.category})
        if(!categoryExist) return res.send({message: 'The category does not exist'})
        if(data.price <= 0) return res.status(400).send({message: 'Price cant be zero'})
        // Validar que no venga el parametro de mas vendidos
        if(data.sales != undefined) return res.status(400).send({message: 'Sales is not allowed'})
        // Validar que no se repita el producto 
        let params = {
            name: new RegExp('^' + data.name + '$', 'i'),
            description: new RegExp('^' + data.description + '$', 'i')
        }
        let product = await Product.findOne(params)
        if(product) return res.status(400).send({message: 'Product already exists'});
        // Validar que venga la imagen
        console.log(req.files);
        let image = req.files.image
        console.log(req.files.image);
        if(image == undefined) return res.status(400).send({message: 'Image not found'});
        // Validar que tenga extension valida
        let imageStructure = image.name.split('.')
        let imageExtension = imageStructure[imageStructure.length - 1].toLowerCase();
        let extensions = ['jpg', 'jpeg', 'png'];
        if(!extensions.includes(imageExtension)) return res.status(400).send({message: 'Invalid extension'});
        // Agregar a las carpetas
        let nameImage = `${data.name} - ${data.description}.${imageExtension}`
        fs.mkdirSync(`./Img/Products/`,{recursive:true});
        fs.createReadStream(image.path).pipe(fs.createWriteStream(`./Img/Products/${nameImage}`));
        // Agregar a la base de datos
        data.image = nameImage;
        let newProduct = new Product(data);
        await newProduct.save()
        return res.send({message: 'product saved succesfully'});
    }catch(err){
        console.error(err)
        if(err.message.includes('required')) return res.status(500).send({message: 'Some params are required'})
        return res.status(500).send({message: 'Error saving product', error: err.message})
    }
}

exports.get = async(req, res)=>{
    try {
        let products = await Product.find({}).populate('category');
        if(Object.entries(products).length == 0)
            return res.status(404).send({message: 'There are not products'})
        return res.send({products})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting products'})
    }
}
exports.getProductCategory = async(req, res)=>{
    try{
        let category = req.params.id
        
        let existCategory = await Category.findOne({_id: category})
        if(!existCategory) return res.send({message: 'The category does not exist'})

        let products = await Product.find({category: category}).populate('category');
        if(Object.entries(products).length == 0) 
            return res.status(404).send({message: 'This category has not products'})
        res.send({message: products})        
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting product by category'})
    }
}

exports.getProduct = async(req,res)=>{
    try{
        let productId = req.params.id
        let productExist = await Product.findOne({_id: productId}).populate('category')
        if(!productExist) return res.send({message: 'Product does not exist'})
        res.send({productExist})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting the product'})
    }
}

exports.getSales = async(req, res)=>{
    try {
        let sales = await Product.find({}).sort({sales: -1}).populate('category')
        return res.send({sales})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting products'})
    }
}

exports.getUnavailables = async(req, res)=>{
    try {
        let unavailables = await Product.find({stock: 0}).populate('category');
        return res.send({unavailables})
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting unavailables'})
    }
}

exports.getProductName = async(req, res)=>{
    try{
        let data = req.body;
        let params = {};
        if(data.name) params.name = { $regex: new RegExp(data.name, "i") };
        if(data.description) params.description = { $regex: new RegExp(data.description, "i") };
        if(data.price) params.price = { $lte: data.price }
        if(data.category) params.category = data.category
        let existProduct = await Product.find(params).sort({price: -1})
        if(Object.entries(existProduct).length == 0) return res.send({message: 'There are not products'})
        return res.send({existProduct})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'error showing product'})
    }
}

exports.update = async(req, res)=>{
    try{
        let productId = req.params.id
        let data = req.body
        let product = await Product.findOne({_id: productId})
        if(!product) return res.status(404).send({message: 'Product not found'})
        if(product.name == 'Deleted' && product.description == 'Product')
            return res.status(404).send({message: 'Deleted product is not allowed'})
        let categoryExist = await Category.findOne({_id: data.category})
        if(!categoryExist) return res.status(404).send({message: 'category does not exist'})
        let required = {
            name: data.name,
            description: data.description,
            stock: data.stock,
            price: data.price,
            category: data.category
        }
        let msg = validateData(required)
        if(msg) return res.status(400).send({msg})
        let params = {
            name: new RegExp('^' + data.name + '$', 'i'),
            description: new RegExp('^' + data.description + '$', 'i')
        }
        let productExists = await Product.findOne(params)
        if(productExists && productExists._id != productId) return res.status(400).send({message: 'Product already exists'});
        if(data.image != undefined) return res.status(400).send({message: 'Image is not allowed'})
        if(data.stock < 0) return res.status(400).send({message: 'Stock can not be zero'})
        if(data.price < 0) return res.status(400).send({message: 'Price can not be zero'})
        // cambiar el subtotal de los carritos y cambiar total
        if(data.price != product.price){
            let carts = await Cart.find({products: {$elemMatch:{product: productId}}})
            if(Object.entries(carts).length != 0){
                carts.forEach(async (item, key) => {
                    let pro = item.products.find(item => item.product == productId)
                    let newSubTotal = pro.quantity * parseInt(data.price);
                    let total = carts[key].total - parseInt(pro.subTotal) + newSubTotal;
                    await carts[key].updateOne({total: total, 'products.$[index].subTotal': newSubTotal},
                        {multi: false, arrayFilters: [{'index.product': productId}]}
                    )
                })
            }
        }
        await product.updateOne(data);
        return res.send({message: 'Product was updated succesfully'});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error updating product', error: err.message})
    }
}

exports.delete = async(req, res)=>{
    try{
        let productId = req.params.id
        let deleteProduct = await Product.findOne({_id: productId})
        if(!deleteProduct) return  res.send({message:'product does not exist'})
        if(deleteProduct.name == 'Deleted' && deleteProduct.description == 'Product')
            return res.status(404).send({message: 'Deleted product is not allowed'})
        let carts = await Cart.find({products: {$elemMatch: {product: productId}}});
        if(Object.entries(carts).length != 0){
            carts.forEach(async (item, key) => {
                let pro = item.products.find(item => item.product == (productId));
                let total = carts[key].total - parseInt(pro.subTotal);
                carts[key].products.pull(pro);
                await carts[key].save();
                await carts[key].updateOne({total: total});
                if(Object.entries(carts[key].products).length == 0)
                    await Cart.findOneAndDelete({_id: carts[key]._id});
            })
        }
        let product = await Product.findOne({name: 'Deleted', description: 'Product'});
        let bill = await Bill.find({products: {$elemMatch: {'product._id': productId}}})
        bill.forEach(async (item, key) => {
            let pro = item.products.find(element => element.product._id == productId)
            if(pro != undefined){
                await bill[key].updateOne({'products.$[index].product._id': product._id},
                {arrayFilters: [{'index._id': pro._id}]});
            }
        })
        await Product.findOneAndDelete({_id: productId})
        fs.unlinkSync(`./Img/Products/${deleteProduct.image}`);
        return res.send({message: 'product deleted succesfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

exports.getPhoto = async(req, res)=>{
    try {
        let productId = req.params.id;
        let product = await Product.findOne({_id: productId});
        if(!product) return res.status(404).send({message: 'Product not found'})
        return res.sendFile(path.resolve(`./Img/Products/${product.image}`))
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting picture'});
    }
}

exports.updatePhoto = async(req, res)=>{
    try {
        let productId = req.params.id;
        let product = await Product.findOne({_id: productId});
        if(!product) return res.status(404).send({message: 'Product not found'});
        // Validar que venga la imagen
        let image = req.files.image
        if(image == undefined) return res.status(404).send({message: 'Image not found'})
        // Validar que tenga extension valida
        let imageStructure = image.name.split('.')
        let imageExtension = imageStructure[imageStructure.length - 1].toLowerCase();
        let extensions = ['jpg', 'jpeg', 'png'];
        if(!extensions.includes(imageExtension)) return res.status(400).send({message: 'Invalid extension'});
        // Agregar a las carpetas
        let nameImage = `${product.name} - ${product.description}.${imageExtension}`
        console.log(product.image);
        fs.unlinkSync(`./Img/Products/${product.image}`);
        await product.updateOne({image: nameImage});
        fs.createReadStream(image.path).pipe(fs.createWriteStream(`./Img/Products/${nameImage}`));
        return res.send({message: 'Image was updated successfully'});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error updating picture'});
    }
}