'use strict'

const Express = require('express');

const api = Express.Router();

const productController = require('../controllers/product.controller');

api.post('/add', productController.addProduct);
api.get('/list', productController.listProducts);
api.put('/update/:id', productController.updateProduct);
api.delete('/delete/:id', productController.deleteProduct);
api.get('/search/:search', productController.search);
api.get('/category/:id', productController.productCategory);
api.get('/soldout', productController.soldOut);

module.exports = api;