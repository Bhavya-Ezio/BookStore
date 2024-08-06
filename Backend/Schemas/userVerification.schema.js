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
        index: { expires: '21600000' }
    },
}
)

export default model("user-verifications", UserVerificationSchema)