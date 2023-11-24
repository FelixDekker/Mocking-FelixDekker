import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import User from '../src/dao/models/user.model.js';
import {createHash, validatePassword} from './utils/bcrypt.js';

passport.use('login', new LocalStrategy({
  usernameField: 'email',
}, async (username, password, done) => {
  
  const user = await User.findOne({ email: username });

  if (!user) {
    return done(null, false);
  }

  const passwordMatch = validatePassword(password, user.password);

  if (!passwordMatch) {
    return done(null, false);
  }

  return done(null, user);
}));

passport.use('register', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
  passwordField: 'password'
}, async (req, username, password, done) => {
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return done(null, false, { message: 'Email already registered' });
    }
    
    const {firstName, lastName, age} = req.body;
    const hashedPassword = createHash(password);

    const newUser = new User({ firstName: firstName, lastName: lastName, age: age, email: username, password: hashedPassword });
    await newUser.save();

    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new GitHubStrategy({
  clientID: '07f24b773c729cffce36',
  clientSecret: '6c960a55bcb45961adbc257788a9164f9cbc4f5b',
  callbackURL: 'http://localhost:8080/auth/github/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ githubId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User ({ githubId: profile.id, email: profile.emails[0].value });
    await newUser.save();

    return done(null, newUser);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = User.findById (id);
    done(null, user);
  });

export default passport;
