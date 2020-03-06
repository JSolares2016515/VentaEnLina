'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');
const key = '1999';

exports.createToken = (user) => {
    var payload = {
        sub: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        iat: moment().unix(),
        exp: moment().add(30, "minutes").unix()
    }

    return jwt.encode(payload, key);
}