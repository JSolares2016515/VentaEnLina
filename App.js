'use strict'

const Express = require('express');
const BodyParser = require('body-parser');
const Morgan = require('morgan');

const App = Express();

App.use(BodyParser.urlencoded({extended: false}));
App.use(BodyParser.json());
App.use(Morgan(':method :url :status :res[content-length] - :response-time ms'));

App.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

module.exports = App;