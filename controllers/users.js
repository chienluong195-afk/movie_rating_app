const User = require("../models/User")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

module.exports.controller = (app) => {
  // local strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, (email, password, done) => {
    User.getUserByEmail(email, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      User.comparePassword(password, user.password, (error, isMatch) => {
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false);
      });
      return true;
    });
  }))

  // user login
  app.post('/users/login',
    passport.authenticate('local', { failureRedirect: '/users/login' }),
    (req, res) => {
      res.redirect('/');
    });

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  // register a user
  app.post('/users/register', (req, res) => {
    const email = req.body.email;
    const fullname = req.body.fullname;
    const password = req.body.password;
    const role = req.body.role || 'user';
    const newUser = new User({
      email: email,
      fullname: fullname,
      role: role,
      password: password
    })
    User.createUser(newUser, function (error, user) {
      if (error) {
        res.status(422).json({
          message: "Something went wrong. Please try again after some !"
        });
      }
      res.send({ user: user })
    })
  })
}