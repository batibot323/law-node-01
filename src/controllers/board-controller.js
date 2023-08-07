const boardService = require ('../services/board-service');
const express = require('express');
const checkAuthHeader = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', checkAuthHeader, async (req, res) => { 
    const userId = req.user_id
    const board = await boardService.getBoard(userId);
    return res.json(board);
});

module.exports = router;