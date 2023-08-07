const boardService = require ('../services/board-service');
const express = require('express');

const router = express.Router();
let defaultUserId = 10;

router.get('/', async (req, res) => { 
    const userId = req.header.user_id || defaultUserId;
    const board = await boardService.getBoard(userId);
    return res.json(board);
});

module.exports = router;