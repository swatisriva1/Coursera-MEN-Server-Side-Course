const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');

const Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//mount this router to the /dishes route inside index.js; here, chain all request types together
dishRouter.route('/')  // use / because we are mounting this router to the /dishes route in index.js
// .all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
// })
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    Dishes.find({})
    .populate('comments.author')   // when dishes are being constructed, populate author from User document
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);   // takes JSON string as input; putting on res --> send it back to client in body of response message
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
// for post, first middleware is to verify user; if successful, move on to next function; if failure, passport authenticate handles showing error
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // for post requests, req.body will contain data
    Dishes.create(req.body)   // body parser has already parsed out the request body and put it in req.body
    .then((dish) => {
        console.log('Dish created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});


dishRouter.route('/:dishId')
.get((req, res, next) => {  
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body 
    }, { new: true })
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});




//mount this router to the /dishes route inside index.js; here, chain all request types together
dishRouter.route('/:dishId/comments')  // use / because we are mounting this router to the /dishes route in index.js
// .all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
// })
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))  // pass off error to error handler of application (app.js)
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {   // for post requests, req.body will contain data
    Dishes.findById(req.params.dishId) 
    .then((dish) => {
        if(dish != null) {
            req.body.author = req.user._id;  // we already have the user from authentication
            dish.comments.push(req.body);   // update dish with posted comments
            dish.save()  // save dish
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')  // need to populate author into comment
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);    // return updated dish
                })
            }, (err) => next(err)); 
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/' + req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            for (var i = dish.comments.length - 1; i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();  // remove comments one by one
            }
            dish.save()  // save dish
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);    // return updated dish
            }, (err) => next(err)); 
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        } 
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else { // comment does not exist
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId + '/comments/' + req.params.commentId);
})
.put(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            if(req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating; // no specific method to update sub-documents so use this approach
            }
            if(req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            dish.save()  // save dish
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);    // return updated dish
                })
            }, (err) => next(err)); 
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else { // comment does not exist
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();  // remove specific comment
            dish.save()  // save dish
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);    // return updated dish
                })
            }, (err) => next(err)); 
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else { // comment does not exist
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))  // pass off error to error handler of application
    .catch((err) => next(err));
});

module.exports = dishRouter;