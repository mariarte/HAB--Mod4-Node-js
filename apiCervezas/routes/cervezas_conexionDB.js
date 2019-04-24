'use strict'

const express = require('express'); // Importando libreria express

const mysql = require('mysql2'); // Importo la libreria MySQL

const connection = mysql.createConnection({ // Creo la conexion con la DB
    host: 'localhost',
    user: 'hackabos',
    database: 'sakila',
    port: 3306,
    password: 'password',
});

const routes = express.Router();

const cervezasArray = [];

/**
 * CREO UN POST PARA INTRODUCIR NUEVAS CERVEZAS EN NUESTRO ARRAY. Y SI LE FALTA ALGÚN DATO SE CONTROLA EL ERROR
 */
routes.post('/', function(req, res) {
    const {
        nombre,
        graduacion,
    } = req.body;
    // console.log(req.body);
    if (!nombre || !graduacion) {
        return res.status(400).send('datos obligatorios');
    }
    cervezasArray.push({
        nombre: nombre,
        graduacion: graduacion,
    });

    res.status(200).send(cervezasArray);
});

/**
 * CREO UN GET PARA MOSTRAR TODAS LAS CERVEZAS QUE TENGO EN EL ARRAY
 */
routes.get('/', function(req, res) {
    connection.query(
        // 'INSERT INTO `actor` (first_name, last_name) VALUES ("MARIA","ARTEAGA")',
        'SELECT * FROM `actor` WHERE first_name="MARIA"',
        // 'DELETE FROM `actor` WHERE first_name="MARIA"',
        function(err, results, fields) {
            console.log(results);
            console.log(fields);
            res.status(200).send(results);
        }
    );
});

/**
 * CREO UN GET PARA MOSTRAR LA CERVEZA QUE LE INDIQUEMOS
 */
routes.get('/:nombre', function(req, res) {
    const { nombre } = req.params;

    console.log(nombre);

    const cervezaEncontrada = cervezasArray.find((cerveza) => {
        if (cerveza.nombre === nombre) {
            return true;
        }
        return false;
    });

    console.log(cervezaEncontrada, nombre);

    if (!cervezaEncontrada) {
        res.status(404).send();
    } else {
        res.send(cervezaEncontrada);
    }
});


/**
 * CREO UN DELETE PARA BORRAR LA CERVEZA QUE SE LE INDIQUE
 */
routes.delete('/:nombre', function(req, res) {
    const { nombre } = req.params;
    let index = 0;
    const cervezaEncontrada = cervezasArray.find((cerveza, i) => {
        if (cerveza.nombre === nombre) {
            index = i;
            return true;
        } else {
            return false;
        }
    });

    if (!cervezaEncontrada) {
        res.status(404).send();
    } else {
        cervezasArray.splice(index, 1); // Borra la cerveza elegida
        console.log(cervezasArray);
        res.status(200).send(cervezasArray);
    }
});


/**
 * USAMOS ESTE MIDDLEWARE PARA CONTROLAR NUESTROS ERRORES
 */
routes.use(function(error, req, res, next) {
    console.error(error.stack)
    res.status(400).send(error.message) // Aquí enviamos el error declarado si no me mandan todo los datos
});


module.exports = routes;