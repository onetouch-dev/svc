import RefreshToken from "./model";

export default class RefreshTokenOperation {
    constructor() {
        this.model = RefreshToken;
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

    async findOneAndUpdate(query, payload) {
        return this.model.findOneAndUpdate(query, payload, { new: true });
    }

    async update(query, payload) {
        return this.model.updateOne(query, payload)
    }

    async delete(query) {
        console.log(query)
        return this.model.deleteOne(query)
    }
};
