'use strict'


function multiplicar(n1, n2) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(n1 * n2), 2000);
    });
}

module.exports = {
    multiplicar,
};