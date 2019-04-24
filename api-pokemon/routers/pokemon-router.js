'use strict';

const express = require('express');

const router = express.Router();

/**
 * To test it from terminal:
 * curl http://localhost:8000/api/pokemons -d '{"name":"pikachu","attacks":[]}'
 * -H 'content-type: application/json' -v
 */
router.post('/pokemons', (req, res, next) => {
    const pokemonData = Object.assign({}, req.body);

    console.log('me llego el siguiente request body', pokemonData);
    /**
     * Simulamos insertar en una bbdd que siempre hay delay
     */
    setTimeout(() => {
        res.status(201).send();
        next();
    }, 2000);
});

router.get('/pokemons', (req, res, next) => {
    const pokemon2 = {
        name: 'bulbasur',
        attacks: ['whip'],
    };

    const data = [{
        name: 'pikachu',
        attacks: ['attack1', 'attack2'],
    }, pokemon2, {
        name: 'charmander',
        attacks: ['fire ball'],
    }];

    res.send(data);
});

router.get('/pokemons/:name', (req, res, next) => {
    const pokemons = [{
        name: 'pikachu',
        attacks: ['attack1', 'attack2'],
    }, {
        name: 'bulbasur',
        attacks: ['whip'],
    }, {
        name: 'charmander',
        attacks: ['fire ball'],
    }];

    const { name } = req.params;
    // const name = req.params.name;

    /**
     * Given a pokemon name, search in our array data the
     * pokemon data
     */
    const pokemonsFound = pokemons.find((pokemon) => {
        if (pokemon.name === name) {
            return true;
        }
        return false;
    });

    if (pokemonsFound.length === 0) {
        res.status(404).send();
    } else {
        res.send(pokemonsFound[0]);
    }
});

module.exports = router;