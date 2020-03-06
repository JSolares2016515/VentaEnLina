'use strict'

const jwt = require('../services/jwt');
const moment = require('moment');
const key = '1999';

exports.ensureAuth = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'Peticion sin autenticación'});
    } else {
        var token = req.headers.authorization.replace(/[""]+/g, '')
        try {
            var payload = jwt.decode(token, key);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({message: 'Token Expirado'});
            }
        } catch (ex) {
            return res.status(404).send({message: 'Token no válido'});
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).send({message: 'Peticion sin autenticación'});
    } else {
        var token = req.headers.authorization.replace(/[""]+/g, '')
        try {
            var payload = jwt.decode(token, key);
            if (payload.exp <= moment().unix()) {
                return res.status(401).send({message: 'Token Expirado'});
            } else if (payload.role != 'ADMIN') {
                return res.status(403).send({message: 'Usuario no autorizado'});
            }
        } catch (ex) {
            return res.status(418).send({message: 'Token no válido'});
        }
        req.user = payload;
        next();
    }
}