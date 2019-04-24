// exporta un objeto con todas las operaciones

'use strict';

function sumar(n1, n2) {
    return n1 + n2;
}

function restar(n1, n2) {
    return n1 - n2;
}

function multiplicar(n1, n2) {
    return n1 * n2;
}

function dividir(n1, n2) {
    if (n2 === 0) {
        throw new Error('not a valid div');
    }
    return n1 / n2;
}

module.exports = {
    sumar,
    restar,
    multiplicar,
    dividir,
};