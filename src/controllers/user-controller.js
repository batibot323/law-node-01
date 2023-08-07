const express = require('express');
const userService = require('../services/user-service');
const boardService = require('../services/board-service');

const router = express.Router();

router.get('/', (req, res) => {
  userService.getusers().then((users) => {res.json(users)});
});

router.post('/', async (req, res) => {
  console.log(req);
  const {user_name: userName, password} = req.body;
  const resp = await userService.createUser(userName, password);
  const user = resp.rows[0]
  await boardService.createBoard(user.id);
  // TODO: We shouldn't return full user.
  res.json(user);
});

module.exports = router;