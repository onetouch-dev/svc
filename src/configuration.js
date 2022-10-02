import * as dotenv from "dotenv";

const parser = dotenv.config().parsed;

const configuration = {
    port: parser.PORT,
    mongourl: parser.MONGO_URL
};

Object.freeze(configuration);

export default configuration;
