const express = require('express');
const taskService = require('../services/task-service');

const router = express.Router();

router.get('/', (req, res) => {
  const tasks = taskService.getTasks();
  res.json(tasks);
});

module.exports = router;