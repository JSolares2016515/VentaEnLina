'use strict'

const Express = require('express');

const api = Express.Router();

const categoryController = require('../controllers/category.controller');

api.post('/add', categoryController.addCategory);
api.get('/list', categoryController.listCategories);
api.put('/update/:id', categoryController.updateCategory);
api.delete('/delete/:id', categoryController.deleteCategory);

module.exports = api;