const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

//mount this router to the /dishes route inside index.js; here, chain all request types together
dishRouter.route('/')  // use / because we are mounting this router to the /dishes route in index.js
.all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
})
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {   // for post requests, req.body will contain data
    res.end('Will add the dish ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    res.end('Deleting all the dishes!');
});


dishRouter.route('/:dishId')
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
})
.post((req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dishId);
})
.put((req, res, next) => {
    res.write('Updating the dish: ' + req.params.dishId + '\n');
    res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);  // the new values sent in put request
})
.delete((req, res, next) => {
    res.end('Deleting dish: ' + req.params.dishId);
});

module.exports = dishRouter;