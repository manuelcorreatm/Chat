import express = require('express');

var router = express.Router();
import Conversation = require('../models/conversation');

/* GET home page. */
router.get('/:userid', function (req, res, next) {
    if (!req.params.userid) {
        return next(new Error('No user id.'));
    }
    //retrieve all users from Monogo
    Conversation.find({ users: { $elemMatch: { id: req.params.userid } } }, function (err, conversations) {
        if (err) {
            return console.error(err);
        } else {
            //JSON response will show all users in JSON format
            res.json(conversations);
        }
    });
});

export = router;