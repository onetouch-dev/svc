import User from "./model";

export default class UserOperation {
    constructor() {
        this.model = User;
    };

    async create(data) {
        return this.model.create(data)
    }

    async count() {
        return this.model.count();
    }

    async findOne(query) {
        return this.model.findOne(query);
    }

    async update(query, payload) {
        return this.model.updateOne(query, payload)
    }
};
