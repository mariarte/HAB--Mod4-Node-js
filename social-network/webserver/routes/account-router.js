"use strict";

const express = require("express");
const router = express.Router();

const activateAccount = require("../controllers/account/activate-account-controller");
const createAccountController = require("../controllers/account/create-account-controller");
const checkLoginController = require("../controllers/account/login-controller");

router.post("/account", createAccountController); // Crear cuenta
router.post("/account/login", checkLoginController); // Hacer el login
router.get("/account/activate", activateAccount);

module.exports = router;