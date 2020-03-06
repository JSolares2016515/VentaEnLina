'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema();

const productSchema = Schema({
    name: String,
    description: Number,
    stock: Number,
    category: {type:Schema.Types.ObjectId, ref: 'category'}
});