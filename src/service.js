import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import {
    Database,
    errorHandler,
    notFoundRoute,
} from "./lib";
import router from "./router";

class Server {
    constructor(configuration) {
        this.app = express();
        this.configuration = configuration;
    };

    bootstrap() {
        this.initializeBodyParser();
        this.setupRoute();
        return this.app;
    };

    initializeBodyParser() {
        const { app } = this;
        app.use(bodyParser.json());
    };

    setupRoute() {
        this.app.use("/health-check", (req, res) => {
            res.send("I am all okay...!!!")
        });

        this.app.use('/api', cors(), router);

        this.app.use(notFoundRoute);
        this.app.use(errorHandler);

    };

    run() {
        const { app, configuration: { port, mongourl } } = this;
        const errorMessage = "Error Encountered";
        const successMessage = `| App listening on port ${port} |`;
        Database.open(mongourl).then((resolve) => {
            resolve(
                app.listen(port, err => {
                    if (err) {
                        console.log("~".repeat(errorMessage.length));
                        console.log(errorMessage.length);
                        console.log("~".repeat(errorMessage.length));
                    }
                    console.log("~".repeat(successMessage.length));
                    console.log(successMessage);
                    console.log("~".repeat(successMessage.length));
                })
            )
        })
    };
};

export default Server;
