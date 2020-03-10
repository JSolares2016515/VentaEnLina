'use strict'

const Express = require('express');
const api = Express.Router();

const userController = require('../controllers/user.controller');
const middlewareAuth = require('../middlewares/authenticated');

api.post('/register', userController.registerUser);
api.get('/list', userController.listUsers);
api.put('/update/:id', middlewareAuth.ensureAuth, userController.updateUser);
api.delete('/delete/:id', middlewareAuth.ensureAuth, userController.deleteUser);
api.post('/login', userController.login);

module.exports = api;