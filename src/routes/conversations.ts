import * as express from 'express';
import * as Conversation from '../models/conversation';
import * as mongoose from 'mongoose';
var router = express.Router();

router.post('/', function (req, res) {
    var conversation = new Conversation();
    conversation.name = req.body.name;
    conversation.avatar = req.body.avatar;
    conversation.users = req.body.users;
    conversation.messages = req.body.messages;
    conversation.type = req.body.type;
    conversation.save(function (err, conversation) {
        if (err) {
            throw err;
        }
        else {
            return res.json(conversation);
        }
    })
});

router.get('/:userid', function (req, res, next) {
    if (!req.params.userid) {
        return next(new Error('No user id.'));
    }
    //retrieve all conversations from Monogo
    Conversation.find({ "users._id": req.params.userid }, function (err, conversations) {
        if (err) {
            return console.error(err);
        } else {
            //JSON response will show all conversations in JSON format
            res.json(conversations);
        }
    });
});

export = router;