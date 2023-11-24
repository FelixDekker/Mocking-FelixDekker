import express from 'express';
import passport from 'passport';

const authRouter = express.Router();

authRouter.get('/register', (req, res) => {
  res.render('register');
});

authRouter.post('/register', passport.authenticate('register'), (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({ mensaje: "User already exists" });
    }

    res.status(201).send({ mensaje: "User successfully registered", userId: req.user_id });
  } catch (error) {
    res.status(500).send({ mensaje: `Register error: ${error}` });
  }
});

authRouter.get('/login', (req, res) => {
  res.render('login');
});

authRouter.post('/login', passport.authenticate("login"), (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({mensaje: "User doesn't exist"});
    }
  
  req.session.user = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    age: req.user.age,
    email: req.user.email,
  };
  
    res.status(200).send({mensaje: "User successfully logged in"});
  } catch (error) {
    res.status(500).send({mensaje: 'Login error: ${error}'});
  }
});

authRouter.get('/logout', (req, res) => {
  if (req.session.user) {
    req.session.destroy();
  }

  res.status(200).send({ result: 'Successful Logout' })
});

authRouter.get('/auth/github',
  passport.authenticate('github'));

authRouter.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/products');
  });

export default authRouter;
