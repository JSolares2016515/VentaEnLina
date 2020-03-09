'use strict'

const Product = require('../models/product');
const Category = require('../models/category');

function addProduct(req, res) {
    const params = req.body;
    let product = Product();
    if (params.name && params.stock && params.price && params.category) {
        Product.findOne({name: params.name}, (err, productFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (productFound) {
                res.send({message: 'Producto ya existente'});
            } else {
                product.name = params.name;
                product.description = params.description;
                product.stock = params.stock;
                product.price = params.price;
                product.category = params.category;
                product.save((err, productSaved) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos', err: err});
                    } else if (productSaved) {
                        res.send({'Product Added': productSaved});
                    } else {
                        res.status(503).send({message: 'Producto no agregado, intente más tarde'});
                    }
                });
            }
        });
    } else {
        res.status(400).send({message: 'Ingrese el nombre del producto, la cantidad, el precio y la categoria'});
    }
}

function listProducts(req, res) {
    Product.find({}, (err, products) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (products) {
            res.send({'Products': products});
        } else {
            res.status(503).send({message: 'No se encontraron productos, intente más tarde'});
        }
    });
}

function updateProduct(req, res) {
    const productID = req.params.id;
    const update = req.body;
    if (update.name) {
        Product.findOne({name: update.name}, (err, productFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (productFound) {
                res.send({message: 'Producto ya existente'});
            } else {
                Product.findOneAndUpdate(productID, update, {new: true}, (err, productUpdated) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos'});
                    } else if (productUpdated) {
                        res.send({'Product Updated': productUpdated});
                    } else {
                        res.status(503).send({message: 'Producto no actualizado, intente más tarde'});
                    }
                });
            }
        });
    } else {
        Product.findOneAndUpdate(productID, update, {new: true}, (err, productUpdated) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (productUpdated) {
                res.send({'Product Updated': productUpdated});
            } else {
                res.status(503).send({message: 'Producto no actualizado, intente más tarde'});
            }
        });
    }
}

function deleteProduct(req, res) {
    const productID = req.params.id;
    Product.findByIdAndDelete(productID, (err, productDeleted) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (productDeleted) {
            res.send({'Product Deleted': productDeleted});
        } else {
            res.status(503).send({message: 'Producto no eliminado, intente más tarde'});
        }
    });
}

function search(req, res) {
    const search = req.params.search;
    Product.find({name: {$regex: search}}, (err, products) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (products) {
            res.send({'Products': products});
        } else {
            res.status(503).send({message: 'No se encontraron productos, intente más tarde'});
        }
    });
}

function productCategory(req, res) {
    const categoryID = req.params.id;
    Product.find({category: categoryID}, (err, products) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (products) {
            if (categoryID != 'Default') {
                Category.populate(products, {path: 'category', select: 'name'}, (err, productsPopulated) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos'});
                    } else if (productsPopulated) {
                        res.send({'Products': productsPopulated});
                    } else {
                        res.status(503).send({message: 'No se pudo cargar las categorias, intente más tarde'});
                    }
                });
            } else {
                res.send({'Products': products});
            }
        } else {
            res.status(503).send({message: 'No se encontraron productos, intente más tarde'});
        }
    });
}

function soldOut(req, res) {
    Product.find({stock: 0}, (err, products) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos', err: err});
        } else if (products) {
            res.send({'Sold Out': products});
        } else {
            res.status(503).send({message: 'No se encontraron productos, intente más tarde'});
        }
    });
}

module.exports = {
    addProduct,
    listProducts,
    updateProduct,
    deleteProduct,
    search,
    productCategory,
    soldOut
}