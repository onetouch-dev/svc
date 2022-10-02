import mongoose from "mongoose";

const schema = new mongoose.Schema({
    token: String,
    userId: mongoose.Types.ObjectId
});

const RefreshToken = mongoose.model("refreshToken", schema);

export default RefreshToken;
