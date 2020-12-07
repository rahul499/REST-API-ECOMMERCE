const mongoose = require('mongoose');
const Product = require('../models/product');



exports.product_get_all = (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
         const response = {
             count: docs.length,
             products: docs.map(doc => {
                 return {
                     name: doc.name,
                     price: doc.price,
                     _id: doc._id,
                     productImage: doc.productImage,
                     request: {
                         type: 'GET',
                         url: 'http://localhost:3000/products/' + doc._id
                     }
                 }
             })
         };
           res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
 }


exports.create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
       _id: new mongoose.Types.ObjectId(),
       name: req.body.name,
       price: req.body.price,
       productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
       res.status(201).json({
        message: 'product created successfuly',
        createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            productImage: result.productImage,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
        }
       });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}



exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: "http://localhost:3000/products"
                }
            });
        } else {
            res.status(404).json({ message: 'No valid entry found for given Id'});
        }

    })
    .catch(err => {
        res.status(500).json({error: err});
    });
}


exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { 
        $set: updateOps
    })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}


exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Product Deleted',
            request: {
                type: 'POST',
                description: 'Create a product',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
       res.status(500).json({
           error:err
       })
    });
}

