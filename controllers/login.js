const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();

/* mongoose implementation
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 });

  response.status(200).send({
    token, username: user.username, name: user.name
  });
});
*/

const pg =  require('pg');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;
  const client = new pg.Client();
  await client.connect();

  const result = await client.query('SELECT id, username, password_hash FROM Users WHERE username=$1', [username]);
  let user;
  let passwordCorrect;
  if (result.rowCount !== 0) {
    user = result.rows[0];
    passwordCorrect = await bcrypt.compare(password, user.password_hash);
  }

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id
  };

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 });

  response.status(200).send({
    token, username: user.username, name: user.name
  });
});

module.exports = loginRouter;