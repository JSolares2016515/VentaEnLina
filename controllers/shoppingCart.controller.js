'use strict'

const ShoppingCart = require('../models/shoppingCart');
const User = require('../models/user');
const Product = require('../models/product');

function addToShoppingCart(req, res) {
    const params = req.body;
    const shopCart = ShoppingCart();
    let total = 0;
    if (params.product && params.amount) {
        ShoppingCart.find({client: req.user.sub}, (err, cart) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (cart) {
                if (cart.length == 0) {
                    shopCart.client = req.user.sub;
                    shopCart.products.push({_id: params.product, amount: params.amount});
                    shopCart.save((err, cartSaved) => {
                        if (err) {
                            res.status(500).send({message: 'Error en la base de datos', err: err});
                        } else if (cartSaved) {
                            User.populate(cartSaved, {path: 'client', select: 'name lastname'}, ((err, cartUser) => {
                                if (err) {
                                    res.status(500).send({message: 'Error en la base de datos', err: err});
                                } else if (cartUser) {
                                    Product.populate(cartUser, {path: 'products._id', select: 'name price'}, (err, cartPopulated) => {
                                        if (err) {
                                            res.status(500).send({message: 'Error en la base de datos', err: err});
                                        } else if (cartPopulated) {
                                            Promise.all(
                                                cartPopulated.products.map(product => {
                                                    let cost = product.amount * product._id.price;
                                                    total = total + cost;
                                                })
                                            ).then(
                                                ShoppingCart.findOneAndUpdate({client: req.user.sub}, {total: total}, {new:true}, (err, cartShop) => {
                                                    if (err) {
                                                        res.status(500).send({message: 'Error en la base de datos', err: err});
                                                    } else if (cartShop) {
                                                        res.send({'Added To Cart': cartShop});
                                                    } else {
                                                        res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
                                                    }
                                                }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'})
                                            )
                                        } else {
                                            res.status(503).send({message: 'Carrito guardado error al popular'});
                                        }
                                    });
                                } else {
                                    res.status(503).send({message: 'Carrito guardado error al popular'});
                                }
                            }));
                        } else {
                            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
                        }
                    });
                } else {
                    ShoppingCart.findOneAndUpdate({client: req.user.sub}, {$push: {products: {_id: params.product, amount: params.amount}}}, {new:true}, (err, addedToCart) => {
                        if (err) {
                            res.status(500).send({message: 'Error en la base de datos', err: err});
                        } else if (addedToCart) {
                            Promise.all(
                                addedToCart.products.map(product => {
                                    let cost = product.amount * product._id.price;
                                    total = total + cost;
                                })
                            ).then(
                                ShoppingCart.findOneAndUpdate({client: req.user.sub}, {total: total}, {new:true}, (err, cartShop) => {
                                    if (err) {
                                        res.status(500).send({message: 'Error en la base de datos', err: err});
                                    } else if (cartShop) {
                                        res.send({'Added To Cart': cartShop});
                                    } else {
                                        res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
                                    }
                                }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'})
                            )
                        } else {
                            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
                        }
                    }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'});
                }
            } else {
                res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
            }
        });
    } else {
        res.status(400).send({message: 'Ingrese un producto y una cantidad'})
    }
    
}

function listCart(req, res) {
    ShoppingCart.findOne({client: req.user.sub}, (err, cart) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (cart) {
            res.send({'Cart': cart});
        } else {
            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
        }
    }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'});
}

function removeFromCart(req, res) {
    const params = req.body;
    let total = 0;
    ShoppingCart.findOneAndUpdate({client: req.user.sub}, {$pull: {products: {_id: params.product}}}, {new:true}, (err, removedFromCart) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (removedFromCart) {
            Promise.all(
                removedFromCart.products.map(product => {
                    let cost = product.amount * product._id.price;
                    total = total + cost;
                })
            ).then(
                ShoppingCart.findOneAndUpdate({client: req.user.sub}, {total: total}, {new:true}, (err, cartShop) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos', err: err});
                    } else if (cartShop) {
                        res.send({'Added To Cart': cartShop});
                    } else {
                        res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
                    }
                }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'})
            )
        } else {
            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
        }
    }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'});
}

function deleteCart(req, res) {
    ShoppingCart.findOneAndDelete({client: req.user.sub}, (err, cartDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (cartDeleted) {
            res.send({'Cart Deleted': cartDeleted});
        } else {
            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
        }
    }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'});
}

module.exports = {
    addToShoppingCart,
    listCart,
    removeFromCart,
    deleteCart
}