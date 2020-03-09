'use strict'

const Express = require('express');

const api = Express.Router();

const cartController = require('../controllers/shoppingCart.controller');
const middlewareAuth = require('../middlewares/authenticated');

api.put('/addToCart', middlewareAuth.ensureAuth, cartController.addToShoppingCart);

module.exports = api;