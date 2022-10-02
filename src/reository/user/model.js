import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = new Schema({
    email: String,
    password: String,
    name: String,
    imageUrl: String,
});

const User = mongoose.model("users", schema);

export default User;