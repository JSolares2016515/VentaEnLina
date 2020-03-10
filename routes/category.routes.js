'use strict'

const Express = require('express');

const api = Express.Router();

const categoryController = require('../controllers/category.controller');
const middlewareAuth = require('../middlewares/authenticated');

api.post('/add', middlewareAuth.ensureAuthAdmin, categoryController.addCategory);
api.get('/list', middlewareAuth.ensureAuth, categoryController.listCategories);
api.put('/update/:id', middlewareAuth.ensureAuthAdmin, categoryController.updateCategory);
api.delete('/delete/:id', middlewareAuth.ensureAuthAdmin, categoryController.deleteCategory);

module.exports = api;