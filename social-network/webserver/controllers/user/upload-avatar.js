"use strict";

const cloudinary = require("cloudinary");
const UserModel = require("../../../models/user-model");

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAvatar(req, res, next) {
    const { file } = req;
    const { uuid } = req.claims;

    if (!file || !file.buffer) {
        return res.status(400).send();
    }

    cloudinary.v2.uploader
        .upload_stream({
                resource_type: "raw",
                public_id: uuid,
                width: 200,
                height: 200,
                format: "jpg",
                crop: "limit"
            },
            async(err, result) => {
                if (err) {
                    return res.status(400).send(err);
                }

                const { etag, secure_url: secureUrl } = result;

                // Actualizar use con la url del avatar
                const filter = {
                    uuid
                };

                const operation = {
                    avatarUrl: secureUrl
                };

                try {
                    await UserModel.updateOne(filter, operation);
                } catch (e) {
                    // Captura el error si el servidor de mongo se ha caido
                    return res.status(500).send(e.message);
                }

                res.header("Location", secureUrl); // Manda un header con la url donde se ha enviado la foto
                res.status(201).send("Foto subida");
            }
        )
        .end(file.buffer);
}

module.exports = uploadAvatar;