const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.orders_get_all = (req, res, next) => {
    Order.find()
   .select('product quantity _id')
   .populate('product', 'name')
   .exec()
   .then(docs => {
        const response = {
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
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



exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
         });
          return order.save()
        })
         .then(result => {
            res.status(201).json({
             message: 'order stored',
             createdOrder: {
                _id: result._id,
                 product: result.product,
                 quantity: result.quantity
                },
                 request: {
                     type: 'GET',
                     url: "http://localhost:3000/orders/" + result._id
                 }
            });
          })
         .catch(err => {
             res.status(500).json({
                 error: err
             });
         });
    }



exports.orders_get_order = (req, res, next) => {
        const id = req.params.orderId;
        Order.findById(id)
        .populate('product')
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({
                    message: "Order not found"
                })
            }
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all orders',
                        url: "http://localhost:3000/orders"
                    }
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
     });
}



exports.orders_delete = (req, res, next) => {
        const id = req.params.orderId;
        Order.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order Deleted',
                request: {
                    type: 'POST',
                    description: 'Create a order',
                    url: 'http://localhost:3000/orders',
                    body: { productId: 'ID', quantity: 'Number'}
                }
            });
        })
        .catch(err => {
           res.status(500).json({
               error:err
           })
    });
}