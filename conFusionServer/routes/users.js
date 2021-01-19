var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
// const authenticate = require('../models/user');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch((err) => next(err));
  // res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => { // username and pw contained in req body
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});  // construct json object with err field and value err (param in callback params)
    }
    else {  // sign up new user
      if(req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save((err, user) => {
        if(err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration successful'});
        });
      })

    }
  });         
});

// first middleware is to verify user; if successful, move on to next function; if failure, passport authenticate handles showing error
router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id: req.user._id}); // keep token payload small -- just user id
  // (above) we know req.user is present since we used passport's local strategy to authenticate, so it will load user onto req
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});


  // below is before using passport

  // if(!req.session.user) {  // if user field not included in signed cookie/session, 
  //   // user has not been authenticated yet; challenge them to authenticate themself
  //   var authHeader = req.headers.authorization;  // get request's auth header (should include base64 encoded string if user entered credentials)
  //   if(!authHeader) {
  //     var err = new Error('You are not authenticated!');
  //     res.setHeader('WWW-Authenticate', 'Basic');  // set the response header (it's kind of empty; only 'Basic')
  //     err.status = 401;   // 401 = unauthorized
  //     next(err);  // go to error handler
  //   }
  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');  
  //   // 0th element is 'Basic'; 1st element is encoded username and pw. then, split on : to get each credential

  //   var username = auth[0];
  //   var password = auth[1];

  //   User.findOne({username: username})
  //   .then((user) => {   // find in db the user based on username
  //     if(user === null) {
  //       var err = new Error('User ' + username + ' does not exist');
  //       err.status = 403;
  //       next(err);  // go to error handler
  //     }
  //     else if(user.password !== password) {
  //       var err = new Error('Your password is incorrect.');
  //       err.status = 403;
  //       next(err);  // go to error handler
  //     }
  //     else if(user.username === username && user.password === password) {
  //       // set up cookie
  //       // res.cookie('user', 'admin', { signed: true });  // name = user; value = admin
  //       req.session.user = 'authenticated';
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type', 'text/plain');
  //       res.end('You are authenticated!');
  //       next();  // pass client request to next middleware
  //     }
  //   })
  //   .catch((err) => next(err));
  // }
  // else {   // user is already logged in
  //   res.statusCode = 200;
  //   res.setHeader('Content-Type', 'text/plain');
  //   res.end('You are already authenticated!');
  // }
});

// note that using JWT, there is not a straightforward way to manually logout; instead wait for token to expire
router.get('/logout', (req, res, next) => {
  if(req.session) {   // session must exist i.e. user must be logged in to logout
    req.session.destroy();  // server-side info pertaining to session is removed --> session is invalidated
    res.clearCookie('session-id');   // ensure user cannot use expired session to contact server
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
