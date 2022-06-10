const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('Users')
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromHeader('authorization')
opts.secretOrKey = process.env.JWT_SEC_KEY

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id)
      .then((user) => {
        if (user) {
          return done(null, user)
        }

        return done(null, false)
      })
      .catch((err) => {
        return done(err, false)
      })
  })
)

module.exports = async (app) => {
  app.use(passport.initialize())
  await googleAuth()
}

const googleAuth = async () => {
  try {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          callbackURL: process.env.CALLBACK_URL,
        },
        (accessToken, refreshToken, profile, done) => {
          User.findOne({ email: profile.emails[0].value })
            .then((user) => {
              if (user) {
                return done(null, user)
              }

              const newUser = new User({
                typeEmail: 'google',
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                password: null,
              })
              newUser.save((err, user) => {
                if (err) {
                  return done(err, false)
                }

                return done(null, user)
              })
            })
            .catch((err) => {
              return done(err, false)
            })
        }
      )
    )
  } catch (error) {
    console.log('Missing google keys')
  }
}

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})
