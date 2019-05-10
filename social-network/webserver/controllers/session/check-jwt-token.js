"use strict";

const jwt = require("jsonwebtoken");
const debug = require("debug"); // Importando DEBUG

const { JWT_PASSWORD: authJwtSecret } = process.env;

async function checkJwtToken(req, res, next) {
    const { authorization } = req.headers;

    debugger;

    if (!authorization) {
        // Compruebo si existe JWT token
        console.error("El token no existe");
        return res.status(401).send();
    }

    const [prefix, token] = authorization.split(" "); // [JWT, xxxx]
    if (prefix !== "JWT") {
        console.error("El prefijo del token debe ser: JWT");
        return res.status(401).send();
    }

    if (!token) {
        // Compruebo si el token no es valido
        console.error("Token diferente");
        return res.status(401).send();
    }
    console.log("Token: ", token);

    try {
        const decoded = jwt.verify(token, authJwtSecret);

        if (!decoded) {
            // Compruebo si el token no es valido
            debug("Token invalido");
            console.error("Token inválido");
            return res.status(401).send();
        }

        req.claims = {
            // Creo una propiedad claims personalizada
            uuid: decoded.uuid,
            role: decoded.role
        };
        console.log("Token perfecto!!!!!");
        return next();
    } catch (e) {
        console.error("ERRORRRRRR");
        return res.status(401).send(e.message);
    }
}

module.exports = checkJwtToken;