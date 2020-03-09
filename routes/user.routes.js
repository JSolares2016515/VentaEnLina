'use strict'

const Express = require('express');
const api = Express.Router();

const userController = require('../controllers/user.controller');

api.post('/register', userController.registerUser);
api.get('/list', userController.listUsers);
api.put('/update/:id', userController.updateUser);
api.delete('/delete/:id', userController.deleteUser);
api.post('/login', userController.login);

module.exports = api;