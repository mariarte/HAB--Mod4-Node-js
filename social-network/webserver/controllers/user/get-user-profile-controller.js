"use strict";

const UserModel = require("../../../models/user-model");

async function getUserProfile(req, res, next) {
    // res.send(`Hola ${req.claims.uuid}`);

    const { uuid } = req.claims;

    const projection = {
        _id: 0,
        __v: 0
    };

    try {
        const userDataProfile = await UserModel.findOne({ uuid }, projection);

        console.log("El perfil buscado es: ");
        console.log(userDataProfile);
        return res.status(200).send(userDataProfile);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

module.exports = getUserProfile;