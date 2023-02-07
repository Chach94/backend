const express = require('express');
const userCtrl = require('../controllers/user')
const limiter = require('../middleware/limiter')

const router = express.Router();
router.use(limiter)
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router; 