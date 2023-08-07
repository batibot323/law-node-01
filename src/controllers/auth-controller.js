const authService = require('../services/auth-service');
const express = require('express');

const router = express.Router();

router.post('/login', async (req, res) => {
    const user = await authService.login(req.body.user_name, req.body.password);
    res.json(user);
});

module.exports = router;