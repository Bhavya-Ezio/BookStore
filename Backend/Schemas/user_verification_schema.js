import { Schema, Types, model } from "mongoose";

const UserVerificationSchema = new Schema({
    uid: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    uString: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        index: { expires: '3600' } // Expire after 6 hours (3600 seconds)
    },
}
)

export default model("user-verifications", UserVerificationSchema)