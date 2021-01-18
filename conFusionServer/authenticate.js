var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
// authenticate is method made available by passport-local-mongoose
// if not using passport-local-mongoose, have to define your own authenticate function

// since using sessions, need to serialize and deserialize user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// create and yield a token for a user
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600});
};

var opts = {};
// populate opts object
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  // token will be in auth header for subsequent requests
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err) {
                return done(err, false);   // done is callback that passport passes into strategy; user is false since there is an error
            }
            else if(user) {
                return done(null, user);  // if we find a user, return no error and the found user
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false});   // use any time we want to verify user's authenticity (uses token in auth header)

exports.verifyAdmin = function(req, res, next) {
    if(req.user.admin) {
        next();
    }
    else {
        var err = new Error("You are not authorized to perform this operation!");
        err.status = 403;
        return next(err);
    }
};