'use strict'

const bodyParser = require('body-parser'); // Importando libreria body-parser
const express = require('express'); // Importando libreria express
const operaciones = require('./calculadora/operaciones');

const app = express();
const port = 3000;


//=============================================================================
/**
 *  HACER UNA RUTA USANDO EL OBJETO EXPRESS ROUTER, QUE NOS SIRVE PARA ORGANIZAR NUESTRO CODIGO. 
 *  USAR RUTAS COMO TIPO: /v2/calculadora/suma  
 */
//=============================================================================
const miRouter = express.Router();

miRouter.get('/suma', function(req, res, next) {
    return res.send('sumar');
});

miRouter.get('/resta', function(req, res, next) {
    return res.send('restar');
});


app.use('/v2/calculadora', miRouter);


//=============================================================================
/**
 * CREAMOS UN HEADER PERSONALIZADO PARA PODER ACCEDER A LA FECHA INICIAL 
 */
//=============================================================================
app.use(function(req, res, next) {
    const n = Date.now();
    req.now = n; // Creo la propiedad now (customizada por mi)
    res.set('x-initial-time', n); // Creo el header customizado
    next();
});

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'));


//=============================================================================
/**
 * SUMA: Usando GET...pasando parametros por query params
 */
//=============================================================================
app.get('/calculadora/suma', function(req, res, next) {
    // console.log('Headers recibidos', req.headers);
    // console.log('el header x-header-inventado tiene el valor:', req.headers['x-header-maria']);
    // console.log('query params recibidos', req.query); // para enviar los parametros

    const {
        n1,
        n2,
    } = req.query; // req.query: Porque los datos van por query 

    const num1 = parseInt(n1, 10);
    const num2 = parseInt(n2, 10);

    if (isNaN(num1) || isNaN(num2)) {
        // return res.status(400).send('n1 and n2 must be numbers');
        const error = new Error('n1 y n2 deben ser números');
        next(error);
    }

    const resultado = operaciones.sumar(num1, num2);

    // PARA ENVIAR EL RESULTADO COMO TEXTO
    // res.send(`${resultado}`);
    // res.send(resultado.toString()); // otra forma de pasar a string

    // PARA ENVIAR EL RESULTADO COMO NUMERO EN FORMATO JSON 
    // const respuesta = {
    //     resultado, // es igual que resultado:resultado
    // };

    req.resultado = resultado; // Guardo el resultado en el req
    next();
});


//=============================================================================
/**
 *  RESTA: Usando POST...pasando los parámetros por body
 */
//=============================================================================
app.post('/calculadora/resta', (req, res, next) => {
    const {
        n1,
        n2,
    } = req.body; // req.body: porque los datos van por body

    const resultado = operaciones.restar(n1, n2);

    req.resultado = resultado;
    next();
});


//=============================================================================
/**
 *  MULTIPLICACION: Usando GET
 */
//=============================================================================
app.get('/calculadora/multiplicacion', function(req, res, next) {
    const {
        n1,
        n2,
    } = req.query;

    const num1 = parseInt(n1, 10);
    const num2 = parseInt(n2, 10);

    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).send('n1 and n2 must be numbers');
    }

    const resultado = operaciones.multiplicar(num1, num2);

    req.resultado = resultado;
    next();
});


//=============================================================================
/**
 * DIVISION: Usando POST...pasando los parámetros por body
 */
//=============================================================================
app.post('/calculadora/division', (req, res, next) => {
    const {
        n1,
        n2,
    } = req.body;

    const resultado = operaciones.dividir(n1, n2);

    req.resultado = resultado;
    next();
});


//=============================================================================
/**
 * USAMOS ESTE MIDDLEWARE PARA PODER USAR CON TODAS LAS OPERACIONES DE LA CALCULADORA
 */
//=============================================================================
app.use(function(req, res) {
    const ahoraFinal = Date.now();
    req.ahora = ahoraFinal;
    let fechaResultado = ahoraFinal - req.now;
    res.set('x-diff-time', fechaResultado); // Creo un header personalizado
    res.send({ resultado: req.resultado }); // Envio el resultado y lo transformo de objeto a json
});


//=============================================================================
/**
 * USAMOS ESTE MIDDLEWARE PARA CONTROLAR NUESTROS ERRORES
 */
//=============================================================================
app.use(function(error, req, res, next) {
    console.error(error.stack)
    res.status(500).send(error.message) // Aquí enviamos el error declarado en los errores de suma
});


//=============================================================================
/**
 * ESCUCHANDO EL PUERTO...
 */
//=============================================================================
app.listen(port, () => console.log(`Example app listening on port ${port}!`));