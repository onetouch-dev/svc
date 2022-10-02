import UserOperation from "../reository/operation"

const seedData = async () => {

    const operation = new UserOperation();
    const count = await operation.count();
    if (!count) {
        await operation.create({ name: "USER-ONE" });
    }
};

export default seedData;
