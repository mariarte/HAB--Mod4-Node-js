'use strict'

const bodyParser = require('body-parser'); // Importando libreria body-parser
const express = require('express'); // Importando libreria express
const cervezas = require('./routes/cervezas_conexionDB');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/cervezas_conexionDB', cervezas);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));