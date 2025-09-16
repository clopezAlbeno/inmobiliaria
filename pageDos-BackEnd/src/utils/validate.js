'use strict'

const bcrypt = require('bcrypt')

exports.validateData = (data)=>{
  let keys = Object.keys(data), msg = '';
  for (let key of keys) {
    if(data[key] !== null && data[key] !== undefined && data[key] !== '') continue
    msg += `The params ${key} is required \n`
  }
  return msg;
}

exports.encrypt = async(password)=>{
  try {
    return bcrypt.hashSync(password, 10)
  } catch (err) {
    console.log(err);
  }
}

exports.compare = async(pass, hash)=>{
  try {
    return bcrypt.compareSync(pass, hash)
  } catch (err) {
    console.log(err);
  }
}