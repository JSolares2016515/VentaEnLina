'use strict'

const Express = require('express');

const api = Express.Router();

const productController = require('../controllers/product.controller');
const middlewareAuth = require('../middlewares/authenticated');

api.post('/add', middlewareAuth.ensureAuthAdmin, productController.addProduct);
api.get('/list', middlewareAuth.ensureAuthAdmin, productController.listProducts);
api.put('/update/:id', middlewareAuth.ensureAuthAdmin, productController.updateProduct);
api.delete('/delete/:id', middlewareAuth.ensureAuthAdmin, productController.deleteProduct);
api.get('/search/:search', middlewareAuth.ensureAuth, productController.search);
api.get('/category/:id', middlewareAuth.ensureAuth, productController.productCategory);
api.get('/soldout', middlewareAuth.ensureAuth, productController.soldOut);

module.exports = api;