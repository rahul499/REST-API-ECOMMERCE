
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.signup_user =  (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message: "Mail already registered"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId,
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        gender: req.body.gender,
                        age: req.body.age
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created'
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        })
                    });
                }
           });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    }); 
}




exports.login_user = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(user => {
        if(user.length < 1) {
            return res.status(401).json({
              message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if(result) {
                const token = jwt.sign({
                    id: user[0]._id,
                    name: user[0].name,
                    email: user[0].email,
                    gender: user[0].gender,
                    age: user[0].age
                }, 
                "secretkey", 
                {
                     expiresIn: "1h"
                }
                );
               return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    }); 
}



exports.delete_user = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(result => {
       res.status(200).json({
           message: 'User deleted'
       })
    })
    .catch(err => {
     res.status(500).json({
         error: err
     })
    });
 }


