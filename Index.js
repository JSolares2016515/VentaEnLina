'use strict'

const Mongoose = require('mongoose');

const App = require('./App');

const PORT = '3400';

Mongoose.Promise = global.Promise;

Mongoose.connect('mongodb://127.0.0.1:27017/OrganizationSystem', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('Conexion a base de datos satisfactoria');
    App.listen(PORT, () => {console.log(`Servidor abierto en puerto '${PORT}'`)});
})
.catch((err) => {console.log('Conexion Erronea', err)});