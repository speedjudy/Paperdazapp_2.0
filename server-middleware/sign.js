import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import env from '../config'
import cookieSession from 'cookie-session'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

passport.serializeUser(function(user, done) {
    /*
    From the user take just the id (to minimize the cookie size) and just pass the id of the user
    to the done callback
    PS: You dont have to do it like this its just usually done like this
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Instead of user this function usually recives the id 
    then you use the id to select the user from the db and pass the user obj to the done callback
    PS: You can later access this data in any routes in: req.user
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID:'287621881624-53liaetf5ain5udjt0r8f6v1rs23rqqn.apps.googleusercontent.com',
    clientSecret:'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',
    callbackURL:'http://localhost:3000/auth/google/callback',
    passReqToCallback:true
  },
  function(request, accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done(null, profile);
  }
));




// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// app.set('view engine','ejs')

// Auth middleware that checks if the user is logged in
// const isLoggedIn = (req, res, next) => {
//     if (req.user) {
//         next();
//     } else {
//         res.sendStatus(401);
//     }
// }

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Example protected and unprotected routes
app.get('/', (req, res) => res.render('pages/index'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// In this route you can see that if the user is logged in u can acess his info in: req.user
app.get('/good', (req, res) =>{
    // res.render("pages/profile",{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value})
    res.send("worked")
})

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  }
);

module.exports = app