import mongoose from "mongoose";
 const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "untitled",
        required: true,
    },
    content: {
        type: String,
        default: "",
        trim: true,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        Permission: {
            type: String,
            enum: ["read", "write"],
            default: "read",
        },
        lastUdated: {
            type: Date,
            default: Date.now,
        },
    },
});

const noteModel = mongoose.model("Note", noteSchema);
export default noteModel;