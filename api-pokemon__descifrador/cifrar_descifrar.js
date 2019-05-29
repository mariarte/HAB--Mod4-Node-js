"use strict";

const crypto = require("crypto");

const algorithm = "aes-256-ctr";
const ENCRYPTION_KEY = 'X<8q8L5Hg/hHhr?pq/LEX)*>H"bdJ.eM';

const iv = crypto.randomBytes(16);

function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(algorithm, ENCRYPTION_KEY, iv);

    const plainMessage = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final()
    ]);

    return plainMessage;
}

const message = encrypt("Hi, we are using AES to cipher this message", "utf8");
console.log(message);
console.log("decrypt", decrypt(message).toString("utf8"));