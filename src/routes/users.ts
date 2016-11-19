import express = require('express');

var router = express.Router();
import User = require('../models/user');

/* GET home page. */
router.get('/', function (req, res) {
    //retrieve all users from Monogo
    User.find({}, function (err, users) {
        if (err) {
            return console.error(err);
        } else {
            //JSON response will show all users in JSON format
            res.json(users);
        }
    });
});

export = router;