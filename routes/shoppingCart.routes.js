'use strict'

const Express = require('express');

const api = Express.Router();

const cartController = require('../controllers/shoppingCart.controller');
const middlewareAuth = require('../middlewares/authenticated');

api.put('/addToCart', middlewareAuth.ensureAuth, cartController.addToShoppingCart);
api.get('/listCart', middlewareAuth.ensureAuth, cartController.listCart);
api.put('/removeFromCart', middlewareAuth.ensureAuth, cartController.removeFromCart);

module.exports = api;