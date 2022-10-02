import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema({
    name: String,
});

const User = mongoose.model("users", schema);

export default User;