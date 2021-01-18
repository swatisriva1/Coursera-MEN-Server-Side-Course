const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//mount this router to the /dishes route inside index.js; here, chain all request types together
leaderRouter.route('/')  // use / because we are mounting this router to the /dishes route in index.js
// .all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
// })
.get((req, res, next) => { 
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);   // takes JSON string as input; putting on res --> send it back to client in body of response message
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // for post requests, req.body will contain data
    Leaders.create(req.body)
    .then((leader) => {
        console.log('Leader created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});


leaderRouter.route('/:leaderId')
.get((req, res, next) => { 
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);   // takes JSON string as input; putting on res --> send it back to client in body of response message
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, { new: true })
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);   // takes JSON string as input; putting on res --> send it back to client in body of response message
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});

module.exports = leaderRouter;