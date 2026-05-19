import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"]
    }
},{
    timestamps: true
})

export const blackListTokenModel = mongoose.model("blacklisttokens", blackListTokenSchema)