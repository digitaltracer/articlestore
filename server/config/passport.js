var LocalStrategy = require('passport-local').Strategy;
//var passport = require('passport');
var User = require('./user.js');

module.exports = function(passport) {
    //passport session setup
    //// passport needs ability to serialize and un-serialize users out of session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    //-----------------------------------------------
    //  LOCAL SIGNUP
    //-----------------------------------------------
    passport.use('local-signup',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },function(req,email,password,done){
        //asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function(){
            //check if the user already exists in the db
            User.findOne({'local.email':email},function(err,user){
                if(err)
                    return done(err)
                if(user){
                    return done(null,false,req.flash('signupMessage','That email is already registered!'));
                } else{
                    var newUser = new User();
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);;
                    newUser.save(function(err){
                        if(err)
                            throw err;
                        return done(null,newUser);
                    });
                }
            });
        });
    }));

    //-----------------------------------------------
    // LOCAL Login
    //-----------------------------------------------
    passport.use('local-login',new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },function(req,email,password,done){
        User.findOne({'local.email':email},function(err,user){
            if(err)
                done(err);
            if(!user){
                return done(null,false,req.flash('loginMessage','No user with that email found!'));
            }
            if(!user.validPassword(password)){
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null,user);
        });
    }));

}