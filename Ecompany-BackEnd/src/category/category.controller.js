'use strict' 

const Category = require('./category.model');
const Product =require('../product/product.model')
const fs = require('fs')
const path = require('path')

exports.test = (req, res)=>{
    res.send({message: 'test category running'})
}

exports.defaultCategory = async()=>{
    try{
        let defCategory = {
            name: 'Default',
            description: 'Category default',
            image: 'ImgDefault.jpg'
        }
        let existCategory = await Category.findOne({name: 'Default'});
        if(existCategory) return console.log('Default category already exists');
        let createdDefault = new Category(defCategory);
        await createdDefault.save();
        return console.log('Default category was created');
    }catch(err){
        return console.error(err);
    }
}

exports.addCategory = async(req, res)=>{
    try{
        let data = req.body; 
        const nameCategory = new RegExp('^' + data.name + '$', 'i');
        let existCategory = await Category.findOne({name: nameCategory})
        if(existCategory) return res.send({message: 'Category already created'})
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
        fs.mkdirSync(`./Img/Category/`,{recursive:true});
        fs.createReadStream(image.path).pipe(fs.createWriteStream(`./Img/Category/${nameImage}`));
        // Agregar a la base de datos
        data.image = nameImage;
        let newCategory = new Category(data)
        await newCategory.save();
        return res.status(201).send({message: 'Created category'})
    }catch(err){
        console.log(err)
        if(err.message.includes('required')) return res.status(500).send({message: 'Some params are required'})
        return res.status(500).send({message: 'Error adding category'});
    }
}

exports.getCategories = async(req, res)=>{
    try{
        let categories = await Category.find();
        return res.send({categories});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting categories'})
    }
}

exports.getCategory = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let category = await Category.findOne({_id: categoryId});
        if(!category) return res.status(404).send({message: 'Category not found'});
        return res.send({category});
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error getting category'})
    }
}

exports.searchCategory = async(req, res)=>{
    try {
        let data = req.body
        let params = {};
        if(data.name) params.name = { $regex: new RegExp(data.name, "i") };
        if(data.description) params.description = { $regex: new RegExp(data.description, "i") };
        let categories = await Category.find(params);
        if(Object.entries(categories).length === 0) return res.status(404).send({message: "Categories not found"})
        return res.send({categories});
    } catch (err) {
        console.log(err);
        return res.status(400).send({message: 'Error searching category'})
    }
}

exports.updateCategory = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let data = req.body;
        // Validar que exista
        let category = await Category.findOne({_id: categoryId})
        if(!category) return res.status(404).send({message: 'Category not found and not updated'});
        // Validar que no sea categoria por defecto
        if(category.name == 'Default') return res.status(400).send({message: 'Category default is not allowed'})
        // Validar que no sea el mismo nombre
        const nameCategory = new RegExp('^' + data.name + '$', 'i');
        let categoryExists = await Category.findOne({name: nameCategory})
        if(categoryExists && categoryExists._id != categoryId) return res.status(400).send({message: 'Category already exists'})
        // Actualizar
        await category.updateOne(data);
        return res.send({message: 'Category was updated succesfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating category'});
    }
}

exports.deleteCategory = async(req, res)=>{
    try{
        let categoryId = req.params.id;
        let defaultCategory = await Category.findOne({name: 'Default'});
        if(defaultCategory._id == categoryId) return res.send({message: 'Default category cannot be deleted'});
        await Product.updateMany(
            {category: categoryId},
            {category: defaultCategory._id},
            {new: true}
        );
        let deletedCategory = await Category.findOneAndDelete({_id: categoryId});
        if(!deletedCategory) return res.status(404).send({message: 'Category not found and not deleted'});
        return res.send({message: 'Category deleted sucessfully', deletedCategory})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error removing category'})
    }
}

exports.getImage = async(req, res)=>{
    try {
        let categoryId = req.params.id;
        let category = await Category.findOne({_id: categoryId});
        if(!category) return res.status(404).send({message: 'Category not found'})
        return res.sendFile(path.resolve(`./Img/Category/${category.image}`))
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error getting picture'});
    }
}

exports.updateImage = async(req, res)=>{
    try {
        let categoryId = req.params.id;
        let category = await Category.findOne({_id: categoryId});
        if(!category) return res.status(404).send({message: 'Category not found'});
        // Validar que venga la imagen
        let image = req.files.image
        if(image == undefined) return res.status(404).send({message: 'Image not found'})
        // Validar que tenga extension valida
        let imageStructure = image.name.split('.')
        let imageExtension = imageStructure[imageStructure.length - 1].toLowerCase();
        let extensions = ['jpg', 'jpeg', 'png'];
        if(!extensions.includes(imageExtension)) return res.status(400).send({message: 'Invalid extension'});
        // Agregar a las carpetas
        let nameImage = `${category.name} - ${category.description}.${imageExtension}`
        console.log(category.image);
        fs.unlinkSync(`./Img/Category/${category.image}`);
        await category.updateOne({image: nameImage});
        fs.createReadStream(image.path).pipe(fs.createWriteStream(`./Img/Category/${nameImage}`));
        return res.send({message: 'Image was updated successfully'});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error updating picture'});
    }
}