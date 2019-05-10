"use strict";

const PostModel = require("../../../models/post-model");
const WallModel = require("../../../models/wall-model");

// Busco por id en el [posts] con el id que tenemos guardado en DB
async function getPostById(postIds) {
    const filter = {
        _id: { $in: postIds },
        deletedAt: null
    };

    console.log(filter._id);

    const posts = await PostModel.find(filter).lean(); // Con .lean() nos devuelve el JSON
    console.log(posts);
    return posts;
}

// Busco en el muro por el id generado antes
async function getUserWall(req, res, next) {
    const { uuid } = req.claims;

    console.log("UUID IMPRESO: ", uuid);

    const filter = {
        uuid
    };

    const projection = {
        _id: 0,
        posts: 1
    };

    try {
        const wall = await WallModel.findOne(filter, projection).lean();
        console.log("WALL IMPRESO: ", wall);
        if (!wall) {
            return {
                data: []
            };
        }

        const posts = await getPostById(wall.posts);
        const response = {
            data: posts
        };

        console.log("WALL.POSTS IMPRESO: ", wall.posts);
        console.log("POSTS IMPRESO: ", posts);

        return res.send(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

module.exports = getUserWall;