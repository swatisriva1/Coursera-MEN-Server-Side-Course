const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

//mount this router to the /dishes route inside index.js; here, chain all request types together
leaderRouter.route('/')  // use / because we are mounting this router to the /dishes route in index.js
.all((req, res, next) => {   // executed for all types of HTTP requests at route /dishes
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();  // execute code for specific request (at route /dishes) and pass on modified req and res 
})
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {   // for post requests, req.body will contain data
    res.end('Will add the leader ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    res.end('Deleting all the leaders!');
});


leaderRouter.route('/:leaderId')
.get((req, res, next) => {  // next is no longer needed; we are finishing handling of get request here
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
})
.post((req, res, next) => {   // for post requests, req.body will contain data
    res.statusCode = 403;
    res.end('POST operation not supported on /leaders/' + req.params.leaderId);
})
.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);  // the new values sent in put request
})
.delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;