"use strict";

require("dotenv").config(); // Importando DOTENV: para usar variables de entorno
const bodyParser = require("body-parser"); // Importando libreria BODY-PARSER: para gestionar los datos que nos vienen por body
const express = require("express"); // Importando EXPRESS
const routers = require("./webserver/routes");
const mysqlPool = require("./databases/mysql-pool"); // Llamada al archivo mysql-pool.js
const mongoPool = require("./databases/mongo-pool");
const debug = require("debug"); // Importando DEBUG
const app = express();
app.use(bodyParser.json());

// Gestiono el error: si no le paso un JSON correcto
app.use((err, req, res, next) => {
    console.log(err);
    res.status(400).send({
        error: `Body Parser: ${err.message}`
    });
});

app.use("/api", routers.accountRouter);
app.use("/api", routers.postRouter);
app.use("/api", routers.userRouter);

async function init() {
    try {
        await mysqlPool.connect(); // Llamada a la funcion connect del archivo mysql-pool.js
        await mongoPool.connect();
    } catch (e) {
        console.error(e); // Controlamos los errores
        process.exit(1); // Para salir del proceso de error y le mandamos en codigo unix el 1
    }

    const port = 3000;
    app.listen(port, () => {
        // Escuchando el puerto
        console.log(`Server running and listening on port ${port}`);
    });
}

init(); // Autollamada de la función init