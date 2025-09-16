'use strict'

const User = require('./user.model');
const { createToken } = require('../services/jwt');
const {encrypt, validateData} = require('../utils/validate');
const { compare } = require('bcrypt');
const fs = require('fs')
const path = require('path')
const Bill = require('../bill/bill.model');
const Cart = require('../cart/cart.model');
const Comment = require('../comment/comment.model')

exports.test = (req,res) =>{
    try{
        res.send({message: 'Function is running'})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error general'})
    }
}
exports.getInfo = async(req, res)=>{
  try {
    let user = {
      sub: req.user.sub,
      name: req.user.name,
      surname: req.user.surname,
      email: req.user.email,
      phone: req.user.phone,
      photo: req.user.photo,
      rol: req.user.rol,
    }
    return res.send({user})
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'Error getting info'});
  }
}
exports.createAdminDefault = async (req, res) => {
  try {
    let adminDefault = {
      name: 'User',
      surname: 'default',
      email: 'admin',
      password: 'admin',
      phone: 'none',
      photo: 'ImgDefault.jpg',
      rol: 'ADMIN'
    }
    adminDefault.password = await encrypt(adminDefault.password);
    let newAdmin = new User(adminDefault)
    await newAdmin.save()
    return console.log('Admin default was created')
  } catch (err) {
    if(err.code === 11000) return console.log('User default already exists')
    return console.log('Error creating user default');
  }
}
exports.createDeletedAccount = async (req, res) => {
  try {
    let deletedAccount = {
      name: 'Deleted',
      surname: 'account',
      email: 'deletedAccount',
      password: 'user',
      phone: 'none',
      photo: 'ImgDefault.jpg',
      rol: 'USER'
    }
    deletedAccount.password = await encrypt(deletedAccount.password);
    let newAccount = new User(deletedAccount)
    await newAccount.save()
    return console.log('Deleted Account was created')
  } catch (err) {
    if(err.code === 11000) return console.log('Deleted Account already exists')
    return console.log('Error creating deleted account');
  }
}

exports.login = async(req, res) => {
  try{
    let data = req.body
    let user = await User.findOne({ email: data.email })
    if(user && user.email == 'deletedAccount') return res.status(400).send({message: 'Unauthorizated user'});
    const message = validateData({password: data.password});
    if(message) return res.status(400).send({message});
    if (user && await compare(data.password, user.password)) {
      let token = await createToken(user)
      return res.send({ message: 'User logged successfully', token});
    }
    return res.status(404).send({ message: 'Invalid credentials' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({message: 'Error in the login'})
  }
}

exports.register = async (req, res) => {
    try {
      let data = req.body
      data.password = await encrypt(data.password)
      data.rol = 'USER';
      data.photo = 'ImgDefault.jpg'
      let newUser = new User(data);
      await newUser.save()
      return res.status(201).send({ message: 'User saved successfully' });
    } catch (err) {
      console.log(err);
      if(err.message.includes('required')) return res.status(500).send({message: `Some params are required`});
      if(err.code == 11000) return res.status(500).send({message: 'Email already exists'});
      return res.status(500).send({message: 'Error register the account'})
    }
}

exports.createAccount = async(req, res) => {
  try{
    let data = req.body;
    data.password = await encrypt(data.password);
    data.rol = 'ADMIN'
    data.photo = 'ImgDefault.jpg'
    let newAccount = new User(data);
    await newAccount.save()
    return res.status(201).send({ message: 'Account created successfully' });
  }catch(err){
    console.error(err);
    if(err.message.includes('required')) return res.status(500).send({message: `Some params are required`});
    if(err.code == 11000) return res.status(500).send({message: 'Email already exists'});
    return res.status(500).send({message: 'Error register the account'})
  }
}

exports.getAccounts = async (req, res) => {
  try{
    let accounts = await User.find({}, {password:0})
    return res.send({accounts});
  }catch(err){
    console.error(err);
    return res.status(500).send({message: 'Error getting accounts'});
  }
}

exports.getPhoto = async(req, res)=>{
  try {
    let userId = req.params.id;
    let user = await User.findOne({_id: userId});
    if(!user) return res.status(404).send({message: 'User not found'});
    let photo = `./Img/Accounts/${user.photo}`;
    return res.sendFile(path.resolve(photo));
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'Error getting photo'});
  }
}

exports.searchAccountById = async (req, res) => {
  try{
    let userId = req.params.id
    let user = await User.findOne({_id: userId}, {password:0});
    if(!user) return res.status(400).send({message: 'User not found'});
    return res.send({user});
  }catch(err){
    console.error(err);
    return res.status(500).send({message: 'Error searching accounts'});
  }
}

exports.searchAccountByFilter = async(req, res)=>{
  try {
    let data = req.body;
    let params = {}
    if(data.name) params.name = { $regex: new RegExp(data.name, "i") };
    if(data.surname) params.surname = { $regex: new RegExp(data.surname, "i") };
    if(data.email) params.email = { $regex: new RegExp(data.email, "i") };
    if(data.rol) params.rol = { $regex: new RegExp(data.rol, "i") };
    let accounts = await User.find(params, {password: 0});
    if(Object.entries(accounts).length === 0) return res.status(404).send({message: 'Account not found'});
    return res.send({message: 'Accounts: ', accounts})
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'Error searching account'});
  }
}

exports.editAccount = async (req, res) => {
  try{
    let data = req.body
    let userId = req.params.id
    // Validar que usuario exista
    let user = await User.findOne({_id: userId}, {password: 0});
    if(!user) return res.status(404).send({message: 'Account not found'})
    // Administrador por defecto no puede actualizarse por nadie
    if(user.email == 'admin') return res.status(400).send({ message: 'Admin default is not allowed' });
    // Nadie puede actualizar contrase;a ni rol ni fotograf[ia]
    if (data.password != undefined) return res.status(400).send({ message: 'Password is not allowed' })
    if (data.rol != undefined) return res.status(400).send({ message: 'Rol is not allowed' })
    if (data.photo != undefined) return res.status(400).send({ message: 'Photo is not allowed' })
    // Validar que vengan datos
    let params = {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone
    }
    let msg = validateData(params);
    if (msg) return res.status(400).send({ msg })
    // Administrador no puede actualizarse a el, solo a usuarios
    if(user.rol == 'ADMIN' && req.user.email != 'admin')
      return res.status(400).send({message: `Admins can't be updated`})
    // Administrador por defecto puede actualizar a todos
    if(req.user.sub != userId && user.rol == 'USER' && req.user.rol != 'ADMIN') 
      return res.status(401).send({message: 'You cant edit this user'})
    await user.updateOne(data);
    return res.send({message: 'User updated successfully'});
  }catch(err){
    console.error(err)
    if(err.code == 11000) return res.status(500).send({message: 'Email already exists'});
    return res.status(500).send({message: 'Error updating account'})
  }
}

exports.updatePassword = async (req, res) => {
  try {
    let userId = req.params.id
    let me = req.user
    // Verficiar que exista
    let user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).send({ message: 'Account not found' });
    // Admin por defecto no se puede actualizar
    if(user.email == 'admin') return res.status(404).send({message: 'Admin default is not allowed'})
    // Administradores no pueden actualizar a otros administradores
    if(user.rol == 'ADMIN' && me.rol == 'ADMIN' && userId != me.sub && me.email != 'admin')
      return res.status(400).send({message: `You can't update this admin`})
    // Usuarios no pueden actualizar a alguien que no sea ellos
    if(me.rol == 'USER' && me.sub != userId) return res.status(400).send({message: 'You cant update this user'})
    // Validar que vengan los dato
    let data = {
      before: req.body.before,
      after: req.body.after
    }
    let msg = validateData(data)
    if (msg) return res.status(400).send({ msg });
    // Validar que no sea la misma
    if(await compare(data.after, user.password))
      return res.status(401).send({ message: `Password can't be same` });
    // Validar que coincidad
    if(!(await compare(data.before, user.password)))return res.status(401).send({ message: 'Invalid Password' });
    // Encriptar contrase;a
    data.after = await encrypt(data.after);
    // Actualizar contrase;a
    await user.updateOne({password: data.after});
    return res.send({message: 'Password was updated successfully'});
  } catch (err) {
    console.error(err);
    return res.status(500).send({message:'Error updating password'})
  }
}

exports.updatePhoto = async(req, res)=>{
  try {
    let userId = req.params.id;
    let me = req.user
    // Validar que usuairo exista
    let user = await User.findOne({_id: userId}, {password: 0});
    if(!user) return res.status(404).send({message: 'User not found'});
    // Validar que no sea admin por defecto 
    if(user.email == 'admin') return res.status(400).send({message: 'Admin default is not allowed'});
    // Validar que sea yo
    if(me.sub != user._id) return res.status(400).send({message: `Can't updated another account`});
    // Validar que el archivo venga
    let img = req.files.photo;
    if(img == undefined) return res.status(404).send({message: 'Image not found'});
    // Validar extension
    let imgStructure = img.name.split('.');
    let imgExtension = imgStructure[imgStructure.length - 1];
    if(imgExtension != 'jpg' && imgExtension != 'png' && imgExtension != 'jpeg')
      return res.status(400).send({message: 'Invalid extension'});
    // validar que no sea imagen por defecto
    if(user.photo != 'ImgDefault.jpg') fs.unlinkSync(`./Img/Accounts/${user.photo}`);
    let imgName = `${user.email} - ${user._id }.${imgExtension}`;
    fs.createReadStream(img.path).pipe(fs.createWriteStream(`./Img/Accounts/${imgName}`));
    await user.updateOne({photo: imgName});
    return res.send({message: 'Image was updated successfully'});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'Error updating photo'})
  }
}

exports.deleteAccount = async (req, res) => {
  try{
    let userId = req.params.id
    let me = req.user
    // Validar que exista
    let user = await User.findOne({_id: userId},{password:0})
    if(!user) return res.status(401).send({message: 'User not found'});
    // Validar que no sea el admin por defecto
    if(user.email == 'admin') return res.status(400).send({message: `Admin default can't be deleted`})
    // Validar que no sea la cuenta de eliminacion
    if(user.email == 'deletedAccount') return res.status(400).send({message: `Deleted Account can't be deleted`})
    // Administradores no pueden eliminar otros administradores
    if(user.rol == 'ADMIN' && me.rol == 'ADMIN' && userId != me.sub && me.email != 'admin')
    return res.status(400).send({message: `You can't delete this admin`})
    // Usuarios solo pueden eliminarse a ellos
    if(me.rol == 'USER' && me.sub != userId) return res.status(400).send({message: 'You cant delete this user'})
    // Validar que no tenga algun pedido
    let billPending = await Bill.findOne({'user._id': userId, state: 'PENDIENTE'});
    if(billPending) return res.status(400).send({message: `Sorry. You have an order`})
    // Validar si tiene productos en el carrito
    await Cart.findOneAndDelete({user: userId});
    // Cabiar las facturas
    let deletedAccount = await User.findOne({email: 'deletedAccount'});
    await Bill.updateMany({ 'user._id': userId }, { 'user._id': deletedAccount._id });
    // Pasar cuenta eliminada los comentarios
    await Comment.updateMany({user: userId}, { 'user': deletedAccount._id })
    // Eliminar fotografia si tiene
    if(user.photo != 'ImgDefault.jpg') fs.unlinkSync(`./Img/Accounts/${user.photo}`);
    await user.deleteOne();
    return res.send({message: 'Account was deleted succesfully'});
  }catch(err){
    console.error(err);
    return res.status(500).send({message:'Error deleting account'})
  }
}

exports.deletePhoto = async(req, res)=>{
  try {
    let userId = req.params.id
    let me = req.user
    // validar que exista
    let user = await User.findOne({_id: userId}, {password: 0});
    if(!user) return res.status(404).send({message: 'User not found'})
    // Validar que no sea admin por defecto
    if(user.email == 'admin') return res.status(400).send({message: 'Admin default is not allowed'});
    // Validar que administradores no puedan a otros administradores
    if((user.rol == 'ADMIN' && me.rol == 'ADMIN' && userId != me.sub && me.email != 'admin') || 
    me.rol == 'USER' && me.sub != userId) return res.status(403).send({message: `You can't delete this picture`});
    // Si tiene fotografia, eliminarla
    if(user.photo == 'ImgDefault.jpg')
      return res.status(404).send({message: `You don't have a picture`});
    fs.unlinkSync(`./Img/Accounts/${user.photo}`);
    await user.updateOne({photo: 'ImgDefault.jpg'})
    return res.send({message: 'Your picture was deleted'});
  } catch (err) {
    console.log(err);
    return res.status(500).send({message: 'Error removing photo'})
  }
}
