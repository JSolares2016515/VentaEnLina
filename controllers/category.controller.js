'use strict'

const Category = require('../models/category');
const Product = require('../models/product');

function addCategory(req, res) {
    const params = req.body;
    let category = Category();
    if (params.name) {
        Category.findOne({name: params.name}, (err, categoryFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (categoryFound) {
                res.send({message: 'Categoría ya existente'});
            } else {
                category.name = params.name;
                category.description = params.description;
                category.save((err, categorySaved) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos'});
                    } else if (categorySaved) {
                        res.send({'Category Added': categorySaved});
                    } else {
                        res.status(503).send({message: 'Categoría no agregada, intente más tarde'});
                    }
                });
            }
        });
    } else {
        res.status(400).send({message: 'Ingrese el nombre de la categoria'});
    }
}

function listCategories(req, res) {
    Category.find({}, (err, categories) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else if (categories) {
            res.send({'Categories': categories});
        } else {
            res.status(503).send({message: 'No se encontro ninguna categoría, intente más tarde'});
        }
    });
}

function updateCategory(req, res) {
    const categoryID = req.params.id;
    const update = req.body;
    if (update.name) {
        Category.findOne({name: update.name}, (err, categoryFound) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (categoryFound) {
                res.send({message: 'Categoría ya existente'});
            } else {
                Category.findOneAndUpdate(categoryID, update, {new: true}, (err, categoryUpdated) => {
                    if (err) {
                        res.status(500).send({message: 'Error en la base de datos'});
                    } else if (categoryUpdated) {
                        res.send({'Category Updated': categoryUpdated});
                    } else {
                        res.status(503).send({message: 'Categoría no actualizada, intente más tarde'});
                    }
                });
            }
        });
    } else {
        Category.findOneAndUpdate(categoryID, update, {new: true}, (err, categoryUpdated) => {
            if (err) {
                res.status(500).send({message: 'Error en la base de datos'});
            } else if (categoryUpdated) {
                res.send({'Category Updated': categoryUpdated});
            } else {
                res.status(503).send({message: 'Categoría no actualizada, intente más tarde'});
            }
        });
    }
}

function deleteCategory(req, res) {
    const categoryID = req.params.id;
    Product.updateMany({category: {$in: [categoryID]}}, {category: 'Default'}, (err, okUpdate) => {
        if (err) {
            res.status(500).send({message: 'Error en la base de datos'});
        } else {
            Category.findByIdAndDelete(categoryID, (err, categoryDeleted) => {
                if (err) {
                    res.status(500).send({message: 'Error en la base de datos', err: err});
                } else if (categoryDeleted) {
                    res.send({'Category Deleted': categoryDeleted});
                } else {
                    res.status(503).send({message: 'Categoría no eliminada, intente más tarde'});
                }
            });
        }
    });
}

module.exports = {
    addCategory,
    listCategories,
    updateCategory,
    deleteCategory
}