import { Schema, model } from "mongoose";

const profileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    bio: {
        type: String,
    },

    address: {
        type: String,
    },

    dob: {
        type: Date,
    },

    avatar: {
        type: String,
    },
});
const profileModel = model("Profile", profileSchema);

export default profileModel
