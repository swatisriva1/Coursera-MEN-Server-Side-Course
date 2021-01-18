const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Promos = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//mount this router to the /dishes route inside index.js; here, chain all request types together
promoRouter.route('/')  // use / because we are mounting this router to the /dishes route in index.js
// .all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
// })
.get((req, res, next) => { 
    Promos.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);   // takes JSON string as input; putting on res --> send it back to client in body of response message
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // for post requests, req.body will contain data
    Promos.create(req.body)   // body parser has already parsed out the request body and put it in req.body
    .then((promo) => {
        console.log('Promotion created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});


promoRouter.route('/:promoId')
.get((req, res, next) => {  
    Promos.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);   // takes JSON string as input; putting on res --> send it back to client in body of response message
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.findByIdAndUpdate(req.params.promoId, {
        $set: req.body 
    }, { new: true })
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));     
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promos.findByIdAndRemove(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});

module.exports = promoRouter;