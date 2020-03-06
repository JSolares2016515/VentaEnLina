'use strict'

const User = require('../models/user');

function registerUser(req, res) {
    const params = req.body;
    const user = User();
    if (params.name && params.username && params.password) {
        
    } else {
        
    }
}

module.exports = {
    registerUser
}