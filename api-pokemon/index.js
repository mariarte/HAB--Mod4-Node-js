'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const routers = require('./routers'); // require all routers

const app = express();

/**
 * Documentation: https://www.npmjs.com/package/body-parser
 * Parse incoming request bodies in a middleware before your handlers,
 * available under the req.body property.
 */
app.use(bodyParser.json());

/**
 * Middlware to know when a request came
 * This middleware is defined before any router
 */
app.use((req, res, next) => {
    req.startDate = Date.now();

    next();
});

app.use('/api', routers.pokemonRouter);
app.use('/api', routers.proxyRouter);
app.use('/api', routers.testRouter);

/**
 * Middlware to show how many time a request needed
 * This middleware goes after all the defined routers
 */
app.use((req, res, next) => {
    const now = Date.now();
    const diff = now - req.startDate;

    console.log(`${req.method} ${req.originalUrl}: ${diff} ms`);
});


app.listen(8000, () => {
    console.log('Server running on port 8000');
});