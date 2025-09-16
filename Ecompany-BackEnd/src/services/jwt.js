'use strict'

const jwt = require('jsonwebtoken');

exports.createToken = async(user)=>{
    try{
        let payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        rol: user.rol,
        iat: Math.floor(Date.now()/ 1000), 
        exp: Math.floor(Date.now()/ 1000) + (60 * 120)  

        }
        return jwt.sign(payload, `${process.env.SECRET_KEY}`);
    }catch(err){
        console.error(err);
        return err;
    }
}