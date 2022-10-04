import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import configuration from "../configuration";


export const generateAccessToken = (user) => {
    return jwt.sign(user, configuration.accesstokenSecretKey, { expiresIn: '10h' })
};

export const generateRefreshToken = (user) => {
    return jwt.sign(user, configuration.refreshtokenSecretKey)
};

export const generateUpdateFields = (field, value) => {
    switch (field) {
        case "name":
            return { name: value };
        case "imageUrl":
            return { imageUrl: value }
    }
}

export const generateUpdatePaylod = (body) => {

    const fields = Object.keys(body);
    const payload = fields.map((ele) => generateUpdateFields(ele, body[ele]))

    let finalObj = {};
    for (let i = 0; i < payload.length; i++) {
        Object.assign(finalObj, payload[i]);
    }

    return finalObj;
};
