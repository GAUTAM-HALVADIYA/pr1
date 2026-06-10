import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false,
    },

    refreshToken: {
        type: String,
        default: null,
    },
});

const userModel = model("User", userSchema);

export default userModel;
