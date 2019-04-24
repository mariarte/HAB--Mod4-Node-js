'use strict'

const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const port = 3000;

app.use(bodyParser.json());

const requestTime = function(req, res, next) {
    console.log('=I=N=I=C=I=O===D=E===S=O=L=U=C=I=O=N=:==');
    const fechaInicial = new Date();
    console.log('***** Fecha inicial', fechaInicial);
    console.log('ENTRANDO EN EL REQUEST TIME...');
    req.headers['x-header-maria-middleware'] = fechaInicial;
    req.headers.time = fechaInicial;

    next();
};

// app.use(requestTime);

app.get("/middlewareDevuelveHeaders", requestTime, function(req, res) {
    console.log('========================================');
    console.log('REQUEST URL:', req.originalUrl);
    console.log('REQUEST TYPE:', req.method);
    console.log('EL HEADER RECIBIDO: ', req.headers);
    console.log('========================================');
    const fechaFinal = new Date();
    console.log('***** Fecha final', fechaFinal);
    let fechaResultado = req.headers.time - fechaFinal;
    fechaResultado = parseInt(fechaResultado);
    console.log(fechaResultado);
    res.set('x-request-time', fechaResultado); // Creo un header personalizado
    res.send({ fechaResultado }); // Envio el resultado
    console.log(res._headers); // Imprimo el elemento donde estan los headers personalizados
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));