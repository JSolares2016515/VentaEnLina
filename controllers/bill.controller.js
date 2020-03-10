'use strict'

const PDF = require('pdfkit');
const FS = require('fs');

const Bill = require('../models/bill');
const ShoppingCart = require('../models/shoppingCart');
const User = require('../models/user');
const Product = require('../models/product');

function createBill(req, res) {
    let newBill = Bill();
    let doc = new PDF();
    ShoppingCart.findOneAndDelete({client: req.user.sub}, (err, cart) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (cart) {
            newBill.client = cart.client;
            newBill.products = cart.products;
            newBill.total = cart.total;
            newBill.save((err, billSaved) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos', err: err});
                } else if (billSaved) {
                    User.populate(billSaved, {path: 'client', select: 'name lastname'}, ((err, billUser) => {
                        if (err) {
                            res.status(500).send({message: 'Error en la base de datos', err: err});
                        } else if (billUser) {
                            Product.populate(billUser, {path: 'products._id', select: 'name price'}, (err, billPopulated) => {
                                if (err) {
                                    res.status(500).send({message: 'Error en la base de datos', err: err});
                                } else if (billPopulated) {
                                    Promise.all(
                                        billPopulated.products.map(async product => {
                                            await Product.findByIdAndUpdate(product._id._id, {$inc: {stock: Number(product.amount)*-1}});
                                        })
                                    ).then(() => {
                                        let name = billPopulated.client.name+' '+ billPopulated.client.lastname+ ' - '+Date.now();
                                        doc.pipe(FS.createWriteStream(`./bills/${name}.pdf`));
                                        doc.text(`Cliente: ${billPopulated.client.name} ${billPopulated.client.lastname}`);
                                        doc.text('Productos: ');
                                        Promise.all(billPopulated.products.map( async p => {
                                            let cost = p.amount*p._id.price;
                                            doc.text(`${p._id.name}      Cantidad: ${p.amount}      Valor: ${p._id.price}       Precio: ${cost}`);
                                        }))
                                        doc.text(`Total: ${billPopulated.total}`);
                                        doc.end();
                                    }).then(
                                        res.send({'Bill': billPopulated})
                                    ).catch((err) => {
                                        res.status(503).send({message: 'Error descontando del stock'});
                                    })
                                } else {
                                    res.status(503).send({message: 'Factura guardada error al popular'});
                                }
                            });
                        } else {
                            res.status(503).send({message: 'Factura guardada error al popular'});
                        }
                    }));
                } else {
                    res.status(503).send({message: 'Factura no disponible, intente más tarde'});
                }
            });
        } else {
            res.status(503).send({message: 'Carro de compras no disponible, intente más tarde'});
        }
    });
}

function listBills(req, res) {
    Bill.find({}, (err, bills) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (bills) {
            res.send({'Bills': bills});
        } else {
            res.status(503).send({message: 'Facturas no disponibles, intente más tarde'});
        }
    });
}

function billsPerUser(req, res) {
    Bill.find({client: req.user.sub}, (err, bills) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (bills) {
            res.send({'Bills': bills});
        } else {
            res.status(503).send({message: 'Facturas no disponibles, intente más tarde'});
        }
    }).populate({path: 'client', select: 'name lastname', model: 'user'}).populate({path: 'products._id', select: 'name price', model: 'product'});
}

function productMoreSold(req, res) {
    Bill.aggregate([{$unwind: '$products'},{$group: {_id: '$products._id', sold: {$sum: '$products.amount'}}}, {$sort:{sold: -1}}], (err, products) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (products) {
            Product.populate(products, {path: '_id', select: 'name'}, (err, productsPopulated) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos', err: err});
                } else if (productsPopulated) {
                    res.send({'Productos mas vendidos': productsPopulated});
                } else {
                    res.status(503).send({message: 'Productos no disponibles, intente más tarde'});
                }
            })
        } else {
            res.status(503).send({message: 'Productos no disponibles, intente más tarde'});
        }
    });
}

module.exports = {
    createBill,
    listBills,
    billsPerUser,
    productMoreSold
}