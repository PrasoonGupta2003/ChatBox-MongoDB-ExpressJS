const mongoose=require("mongoose");

const chatSchema=new mongoose.Schema({
    from:{
        type: String,
        required: true,
    },
    to:{
        type: String,
        required: true,
    },
    msg:{
        type: String,
        maxLength: 300,
    },
    likes: {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        required: true,
    }
})
const Chat = new mongoose.model("Chat", chatSchema);

module.exports = Chat;
