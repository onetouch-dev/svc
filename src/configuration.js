import * as dotenv from "dotenv";

dotenv.config();

const configuration = {
    port: process.env.PORT,
    mongourl: process.env.MONGO_URL,
    accesstokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshtokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    saltRound: process.env.SALT_ROUND,
    password: process.env.PASSWORD,
    profileImage: process.env.PROFILE_IMAGE,
};

Object.freeze(configuration);

export default configuration;
