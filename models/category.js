'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const categorySchema = Schema({
    name: String,
    description: String
});

module.exports = Mongoose.model('category', categorySchema);