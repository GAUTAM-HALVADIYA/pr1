import mongoose, { Mongoose } from "mongoose";

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    otp: {
        type: String,
        required: true,
    },

    purpose: {
        type: String,
        required: true,
        enum: ["REGISTER", "LOGIN", "FORGOT_PASSWORD"],
    },

    expiresAt: {
        type: Date,
        required: true,
    },

    isUsed: {
        type: Boolean,
        default: false,
    },
});

const otpModel = mongoose.model("Otp", otpSchema)

export default otpModel
