'use strict'

const ShoppingCart = require('../models/shoppingCart');

function addToShoppingCart(req, res) {
    const params = req.body;
    const shopCart = ShoppingCart();
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
                            res.send({'Added To Cart': cartSaved});
                        } else {
                            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
                        }
                    });
                } else {
                    ShoppingCart.findOneAndUpdate({client: req.user.sub}, {$push: {products: {_id: params.product, amount: params.amount}}}, (err, addedToCart) => {
                        if (err) {
                            res.status(500).send({message: 'Error en la base de datos', err: err});
                        } else if (addedToCart) {
                            res.send({'Added To Cart': addedToCart});
                            //HACER QUE CALCULE EL COSTO Y COSTO TOTAL CON MAP
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

function removeFromCart(req, res) {
    const params = req.body;
    ShoppingCart.findOneAndUpdate({client: req.user.sub}, {$push: {products: {_id: params.product, amount: params.amount}}}, (err, addedToCart) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (addedToCart) {
            res.send({'Added To Cart': addedToCart});
        } else {
            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
        }
    }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'});
}

module.exports = {
    addToShoppingCart
}