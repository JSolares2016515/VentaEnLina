'use strict'

const Express = require('express');

const api = Express.Router();

const billController = require('../controllers/bill.controller');
const middlewareAuth = require('../middlewares/authenticated');

api.post('/createBill', middlewareAuth.ensureAuth, billController.createBill);
api.get('/billsUser', middlewareAuth.ensureAuth, billController.billsPerUser);
api.get('/moreSold', middlewareAuth.ensureAuth, billController.productMoreSold);

module.exports = api;