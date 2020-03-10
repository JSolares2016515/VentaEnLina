'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const billSchema = Schema({
    client: {type:Schema.Types.ObjectId, ref: 'user'},
    products: [{
        _id: {type:Schema.Types.ObjectId, ref: 'product'},
        amount: Number
    }],
    total: Number
});

module.exports = Mongoose.model('bill', billSchema);