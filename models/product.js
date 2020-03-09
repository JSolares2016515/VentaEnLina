'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const productSchema = Schema({
    name: String,
    description: String,
    stock: Number,
    price: Number,
    category: {type:Schema.Types.Mixed, ref: 'category'}
});

module.exports = Mongoose.model('product', productSchema);