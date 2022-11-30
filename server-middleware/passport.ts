import express from 'express'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import env from '../config'
import cookieSession from 'cookie-session'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as TwitterStrategy } from 'passport-twitter'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'

// const express = require('express')
// const passport = require('passport')
// const cookieParser = require('cookie-parser')
// // const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
// const GoogleStrategy = require('passport-google-oauth20').Strategy
// const FacebookStrategy = require('passport-facebook').Strategy
// const TwitterStrategy = require('passport-twitter').Strategy
// const cookieSession = require('cookie-session')
// const jwt = require('jsonwebtoken')
// const env = require('../config')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(
  cookieSession({
    name: 'auth-session',
    keys: ['key1', 'key2'],
  })
)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (
  user: any,
  done: (arg0: null, arg1: any) => void
) {
  done(null, user as any)
})

passport.deserializeUser(function (
  user: any,
  done: (arg0: null, arg1: any) => void
) {
  done(null, user as any)
})

// passport.serializeUser(function(user, done) {
//   /*
//   From the user take just the id (to minimize the cookie size) and just pass the id of the user
//   to the done callback
//   PS: You dont have to do it like this its just usually done like this
//   */
//   done(null, user as any);
// });

// passport.deserializeUser(function(user, done) {
//   /*
//   Instead of user this function usually recives the id 
//   then you use the id to select the user from the db and pass the user obj to the done callback
//   PS: You can later access this data in any routes in: req.user
//   */
//   done(null, user as any);
// });

const appUrl = (env.APP_URL || '').replace(/\/+$/, '')
    console.log(appUrl)

passport.use(
  new FacebookStrategy(
    {
      clientID: env.FACEBOOK_APP_ID, 
      clientSecret: env.FACEBOOK_APP_SECRET,
      callbackURL: `${appUrl}/auth/facebook/callback`,
      // callbackURL: 'https://996f-41-190-3-24.ngrok.io/auth/facebook/callback',
      profileFields: [
        'id',
        'displayName',
        'name',
        'gender',
        'profileUrl',
        'emails',
        'photos',
      ],
    },
    (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: (arg0: null, arg1: any) => any
    ) => {
      console.log(profile);
      return done(null, profile)
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${appUrl}/auth/google/callback`,
      // passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    (
      accessToken: any,
      refreshToken: any,
      profile: any,
      cb: (arg0: null, arg1: any) => any
    ) => {
      console.log(profile);
      return cb(null, profile)
    }
  )
)

passport.use(
  new TwitterStrategy(
    {
      consumerKey: env.TWITTER_CONSUMER_KEY,
      consumerSecret: env.TWITTER_CONSUMER_SECRET,
      // callbackURL: 'http://localhost:3000/auth/twitter/callback',
      callbackURL: `${appUrl}/auth/twitter/callback`,
      includeEmail: true,
    },
    (
      token: any,
      tokenSecret: any,
      profile: any,
      done: (arg0: null, arg1: any) => any
    ) => {
      return done(null, profile)
    }
  )
)

app.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)
app.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
)

app.get('/twitter', passport.authenticate('twitter'))

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login?error=Login%20Failed',
  }),
  (req: any, res: any) => {
    const user = req.user
    const token = jwt.sign(user, env.ENCRYPTION_KEY)
    req.logOut()
    res.redirect(`/login?token=${token}`)
    // res.redirect(`/here`)
  }
)

app.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login?error=Login%20Failed',
  }),
  (req: any, res: any) => {
    const user = req.user
    const token = jwt.sign(user, env.ENCRYPTION_KEY)
    req.logOut()
    res.redirect(`/login?token=${token}`)
  }
)

app.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login?error=Login%20Failed',
  }),
  (req: any, res: any) => {
    const user = req.user
    const token = jwt.sign(user, env.ENCRYPTION_KEY)
    req.logOut()
    res.redirect(`/login?token=${token}`)
  }
)

app.get('/here', function (req: any, res: { send: (arg0: string) => void }) {
  res.send('This is just for testing purposes')
})

module.exports = app
