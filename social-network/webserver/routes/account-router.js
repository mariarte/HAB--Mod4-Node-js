'use strict';

const express = require('express');
const router = express.Router();

const createAccountController = require('../controllers/create-account-controller');
const checkLoginController = require('../controllers/login-controller')

router.post('/account', createAccountController); // Para crear cuenta
router.post('/account/login', checkLoginController); // Para hacer el login

module.exports = router;