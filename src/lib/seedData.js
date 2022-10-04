import * as bcrpyt from "bcrypt";
import configuration from "../configuration";

import UserOperation from "../reository/user/operation"

const seedData = () => {
    const operation = new UserOperation();
    operation.count().then((res) => {
        if (res === 0) {
            bcrpyt.hash(configuration.password, parseInt(configuration.saltRound), (err, hash) => {
                if (err) {
                    console.log(err);
                } else {
                    operation.create({
                        name: "Nikhil Rawat",
                        email: "nikhil.rawat@gmail.com",
                        password: hash,
                        imageUrl: configuration.profileImage
                    });
                    operation.create({
                        name: "user two",
                        email: "user.two@gmail.com",
                        password: hash,
                        imageUrl: configuration.profileImage
                    });
                    operation.create({
                        name: "user three",
                        email: "user.three@gmail.com",
                        password: hash,
                        imageUrl: configuration.profileImage
                    });
                }
            })
        }
    })
};

export default seedData;
