import User from "./model";

export default class UserOperation {
    constructor() {
        this.model = User;
    };

    async create (data) {
        await this.model.create(data, function(err, data) {
            if(err) {
                return new Error("error");
            }
        });
    }

    async count () {
        return this.model.count();
    }
};
