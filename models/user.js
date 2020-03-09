'use strict'

const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;

const userSchema = Schema({
    name: String,
    lastname: String,
    username: String,
    password: String,
    role: String
});

module.exports = Mongoose.model('user', userSchema);