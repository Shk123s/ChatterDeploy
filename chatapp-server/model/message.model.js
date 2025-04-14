const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    message: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    messageType: {
        type: String,
        enum: ["text", "video", "audio", "file"],
        required: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true 
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model("Message", messageSchema);