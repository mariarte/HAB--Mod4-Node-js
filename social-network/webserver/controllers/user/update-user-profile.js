"use strict";

const Joi = require("joi");
const dot = require("dot-object");

const UserModel = require("../../../models/user-model");

async function validate(payload) {
    const schema = {
        /** No es necesario porque el uuid está en el token y es inmutable
         *  uuid: Joi.string().uuid({
         *  version: ['uuidv4'],
         * }),
         */
        fullName: Joi.string()
            .min(3)
            .max(128)
            .required(),
        preferences: Joi.object().keys({
            isPublicProfile: Joi.bool(),
            linkedIn: Joi.string().allow(null),
            twitter: Joi.string().allow(null),
            github: Joi.string()
                .uri()
                .allow(null),
            description: Joi.string().allow(null)
        })
    };
    return Joi.validate(payload, schema);
}

async function updateUserProfile(req, res, next) {
    const userDataProfile = {...req.body };
    const { claims } = req;
    /**
     * Validar los datos
     */
    try {
        await validate(userDataProfile);
    } catch (e) {
        return res.status(400).send(e.message);
    }

    /**
     * Actualizar los datos en mongo
     */
    // const userDataProfileMongoose = {
    //     fullName: userDataProfile.fullName,
    //     "preferences.isPublicProfile": userDataProfile.preferences.isPublicProfile,
    //     "preferences.linkedIn": userDataProfile.preferences.linkedIn,
    //     "preferences.twitter": userDataProfile.preferences.twitter,
    //     "preferences.github": userDataProfile.preferences.github,
    //     "preferences.description": userDataProfile.preferences.description
    // };

    try {
        const userDataProfileMongoose = dot.dot(userDataProfile);
        const data = await UserModel.updateOne({ uuid: claims.uuid },
            userDataProfileMongoose
        );

        console.log("mongoose data", data);
        return res.status(204).send("Enviado a DB");
    } catch (e) {
        return res.status(500).send(e.message);
    }
}

module.exports = updateUserProfile;