const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/auth');

const { getStatus, putStatus } = require('../controllers/status');

const router = express.Router();

router.get('/', isAuth, getStatus);

router.put('/', isAuth, body('status').trim().not().isEmpty(), putStatus);

module.exports = router;
