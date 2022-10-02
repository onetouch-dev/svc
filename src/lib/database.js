import * as mongoose from 'mongoose';

import seedData from './seedData';

class Database {
    static open(mongourl) {
        return new Promise((resolve, reject) => {
            mongoose.connect(mongourl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve(() => {
                    seedData();
                    const message = "| Database connected |";
                    console.log("~".repeat(message.length));
                    console.log(message);
                    console.log("~".repeat(message.length));

                });
            });
        });
    }
    static disconnect() {
        console.log("Database disconnected");
    }
}

export default Database;