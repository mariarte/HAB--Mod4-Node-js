'use strict';

const { sumar } = require('./operaciones/sumar');
const { restar } = require('./operaciones/restar');
const { multiplicar } = require('./operaciones/multiplicar');
const { dividir } = require('./operaciones/dividir');

console.log(sumar(5, 3));

console.log(restar(5, 3));

console.log(multiplicar(3, 4));
multiplicar(3, 4).then((resultMul) => {
    console.log(`Multiplicación: ${resultMul}`);
}).catch((err) => {
    console.log('errorMul', err);
});


console.log(dividir(4, 2));
dividir(4, 2).then((resultDiv) => {
    console.log(`Division: ${resultDiv}`);
}).catch((err) => {
    console.log('resultDiv error', err);
});