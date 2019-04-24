"use strict";

require("dotenv").config(); // Importando DOTENV: para usar variables de entorno
const bodyParser = require("body-parser"); // Importando libreria BODY-PARSER: para gestionar los datos que nos vienen por body
const express = require("express"); // Importando EXPRESS
const accountRouter = require("./webserver/routes/account-router"); // Llamada al archivo account-router.js
const loginRouter = require("./webserver/controllers/login-controller"); // Llamada al archivo login-router.js
const mysqlPool = require("./databases/mysql-pool"); // Llamada al archivo mysql-pool.js
const debug = require("debug"); // Importando DEBUG
const app = express();
app.use(bodyParser.json());

app.use("/api", accountRouter);
app.use("/api", loginRouter);

async function init() {
    try {
        await mysqlPool.connect(); // Llamada a la funcion connect del archivo mysql-pool.js
    } catch (e) {
        console.error(e); // Controlamos los errores
        process.exit(1); // Para salir del proceso de error y le mandamos en codigo unix el 1
    }

    const port = 3000;
    app.listen(port, () => {
        // Escuchando el puerto
        debug("listening"); //************* */
        console.log(`Server running and listening on port ${port}`);
    });
}

init(); // Autollamada de la función init