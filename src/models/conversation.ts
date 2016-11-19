import mongoose = require('mongoose');

var Schema = mongoose.Schema;

// create User Schema
var ConversationSchema = new Schema({
    name: String,
    avatar: { type: String, default: "/assets/img/ghosty.png" },
    users: [{
        id: String,
        email: String,
        name: String,
        avatar: String
    }],
    messages: [{
        sender: {
            email: String,
            name: String,
            avatar: String
        },
        message: String
    }]
});

interface ConversationModel extends chat.Conversation, mongoose.Document { }
var Conversation = mongoose.model<ConversationModel>('Conversation', ConversationSchema);

export = Conversation;