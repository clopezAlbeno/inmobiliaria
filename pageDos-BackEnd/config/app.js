'use strict'

const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const usuarioRoutes = require('../src/user/user.routes');
const formularioRoutes = require('../src/form/form.routes');

const port = process.env.PORT || 3300;

// Middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/formularios', formularioRoutes);

exports.initServer = () => {
    app.listen(port, () => {
        console.log(`✅ Server running on port ${port}`);
    });
};