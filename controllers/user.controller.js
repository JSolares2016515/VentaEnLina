'use strict'

const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function registerUser(req, res) {
    const params = req.body;
    const user = User();
    if (params.name && params.username && params.password) {
        User.findOne({username: params.username}, (err, userFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (userFound) {
                res.send({message: 'Nombre de usuario ya utilizado'});
            } else {
                bcrypt.hash(params.password, null, null, (err, hashPassword) => {
                    if (err) {
                        res.status(500).send({message: 'Error al encriptar'});
                    } else {
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.password = hashPassword;
                        user.role = 'USER';
                        user.save((err, userRegistered) => {
                            if (err) {
                                res.status(500).send({message: 'Error en la base de datos'});
                            } else if (userRegistered) {
                                res.send({'User Registered': userRegistered});
                            } else {
                                res.status(503).send({message: 'Usuario no registrado, intente más tarde'});
                            }
                        });
                    }
                }); 
            }
        });    
    } else {
        res.status(400).send({message: 'Ingrese el nombre, usuario y contraseña'});
    }
}

function listUsers(req, res) {
    User.find({}, (err, users) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (users) {
            res.send({'Users': users});
        } else {
            res.status(503).send({message: 'No se encontraron usuarios, intente más tarde'});
        }
    });
}

function updateUser(req, res) {
    const userID = req.params.id;
    let update = req.body;
    if (req.user.role == 'ADMIN') {
        if (update.password) {
            bcrypt.hash(update.password, null, null, (err, hashPassword) => {
                if (err) {
                    res.status(500).send({message: 'Error al encriptar'});
                } else {
                    update.password = hashPassword;
                    User.findByIdAndUpdate(userID, update, {new:true}, (err, userUpdated) => {
                        if (err) {
                            res.status(500).send({message: 'Error en la base de datos'});
                        } else if (userUpdated) {
                            res.send({'User Updated': userUpdated});
                        } else {
                            res.status(503).send({message: 'Usuario no actualizado, intente más tarde'});
                        }
                    });
                }
            });
        } else {
            User.findByIdAndUpdate(userID, update, {new:true}, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos'});
                } else if (userUpdated) {
                    res.send({'User Updated': userUpdated});
                } else {
                    res.status(503).send({message: 'Usuario no actualizado, intente más tarde'});
                }
            });
        }
    } else if (userID == req.user.sub) {
        if (update.password) {
            bcrypt.hash(update.password, null, null, (err, hashPassword) => {
                if (err) {
                    res.status(500).send({message: 'Error al encriptar'});
                } else {
                    update.password = hashPassword;
                    User.findByIdAndUpdate(userID, update, {new:true}, (err, userUpdated) => {
                        if (err) {
                            res.status(500).send({message: 'Error en la base de datos'});
                        } else if (userUpdated) {
                            res.send({'User Updated': userUpdated});
                        } else {
                            res.status(503).send({message: 'Usuario no actualizado, intente más tarde'});
                        }
                    });
                }
            });
        } else {
            User.findByIdAndUpdate(userID, update, {new:true}, (err, userUpdated) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos'});
                } else if (userUpdated) {
                    res.send({'User Updated': userUpdated});
                } else {
                    res.status(503).send({message: 'Usuario no actualizado, intente más tarde'});
                }
            });
        }
    } else {
        res.status(400).send({message: 'Error de permisos', user: userID, userID: req.user.sub});
    }  
}

function deleteUser(req, res) {
    const userID = req.params.id;
    if (req.user.role == 'ADMIN') {
        User.findByIdAndDelete(userID, (err, userDeleted) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (userDeleted) {
                res.send({'User Deleted': userDeleted});
            } else {
                res.status(503).send({message: 'Usuario no eliminado, intente más tarde'});
            }
        })
    } else if (userID == req.user.sub) {
        User.findByIdAndDelete(userID, (err, userDeleted) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (userDeleted) {
                res.send({'User Deleted': userDeleted});
            } else {
                res.status(503).send({message: 'Usuario no eliminado, intente más tarde'});
            }
        })
    } else {
        res.status(400).send({message: 'Error de permisos', permiso1: req.user.role});
    }
}

function login(req, res) {
    const params = req.body;
    if (params.username && params.password) {
        User.findOne({username: params.username}, (err, userFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (userFound) {
                bcrypt.compare(params.password, userFound.password, (err, checkPassword) => {
                    if (err) {
                        res.status(500).send({message: 'Error al comparar contraseñas'});
                    } else if (checkPassword) {
                        if (params.getToken) {
                            res.send({token: jwt.createToken(userFound)});
                        } else {
                            res.send({'User': userFound});
                        }
                    } else {
                        res.status(503).send({message: 'Contraseña incorrecta'});
                    }
                })
            } else {
                res.status(503).send({message: 'Usuario no encontrado'});
            }
        });
    } else {
        res.status(400).send({message: 'Ingrese un usuario y una contraseña'});
    }
}

module.exports = {
    registerUser,
    listUsers,
    updateUser,
    deleteUser,
    login
}