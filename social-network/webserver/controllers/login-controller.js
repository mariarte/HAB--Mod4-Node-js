"use strict";

const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const mysqlPool = require("../../databases/mysql-pool");

/**
 * Funcion que valida los datos de entrada
 */
async function validateData(payload) {
    const schema = {
        email: Joi.string()
            .email({ minDomainAtoms: 2 })
            .required(),
        password: Joi.string()
            .regex(/^[a-zA-Z0-9]{3,30}$/)
            .required()
    };
    return Joi.validate(payload, schema);
}

/**
 * Funcion que hace el login, comprobando si email y password existen en DB
 */
async function checkLogin(req, res, next) {
    const accountData = req.body;

    try {
        await validateData(accountData); // Valido los datos con JOI
    } catch (e) {
        console.error("Error: User / Password deben cumplir un patron...");
        return res.status(400).send(e);
    }

    try {
        // Checkea el email para saber si existe y si coincide con el de DB
        const connection = await mysqlPool.getConnection();
        const consultaDB = `SELECT * FROM users WHERE email = '${
      accountData.email
    }'`;

        const [resultado] = await connection.query(consultaDB);
        const fichaUser = resultado[0]; // Guardo la consulta en una variable

        // CONTROLES PROPIOS
        // console.log('Email body: ', accountData.email); // Email pasado por body
        // console.log('Email DB: ', fichaUser.email); // email de la DB
        if ((accountData.email = fichaUser.email)) {
            // console.log('ok email');
        } else {
            console.error("Error: User no coincide con DB");
        }

        // Checkea la password si coincide con la de la DB
        const passwordCoincide = await bcrypt.compare(
            accountData.password,
            fichaUser.password
        );
        if (!passwordCoincide) {
            console.error("Error: Password no coincide con DB");
            return res.status(401).send();
        }

        // CONTROLES PROPIOS
        // console.log(passwordCoincide);
        // console.log('Password body: ', accountData.password); // Password pasado por body
        // console.log('Password DB: ', fichaUser.password); // Password de la DB

        // Genero un token con el uuid + fecha de expiracion
        const token = {
            uuid: fichaUser.uuid
        };

        const resultToken = jwt.sign(token, process.env.JWT_PASSWORD, {
            expiresIn: Math.floor(Date.now() / 1000) + 60 * 60
        });

        // Enviamos la respuesta
        console.log("El login esta OK");
        // return res.status(201).send();
        return res.status(200).json({ resultToken });
    } catch (e) {
        console.error("Error: User / Password no coinciden...");
        return res.status(401).send(e.message);
    }
}

module.exports = checkLogin;