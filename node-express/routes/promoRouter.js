const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

//mount this router to the /dishes route inside index.js; here, chain all request types together
promoRouter.route('/')  // use / because we are mounting this router to the /dishes route in index.js
.all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
})
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {   // for post requests, req.body will contain data
    res.end('Will add the promotion ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all the promotions!');
});


promoRouter.route('/:promoId')
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    res.end('Will send details of the promotion: ' + req.params.promoId + ' to you!');
})
.post((req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /promotions/' + req.params.promoId);
})
.put((req, res, next) => {
    res.write('Updating the promotion: ' + req.params.promoId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);  // the new values sent in put request
})
.delete((req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter;