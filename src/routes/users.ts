import * as express from 'express';
import * as User from '../models/user';

var router = express.Router();

/* GET home page. */
router.get('/:userid', function (req, res) {
    //retrieve all users from Monogo
    User.find({ "_id": { $ne: req.params.userid } }, { name: 1, email: 1, avatar: 1 }, function (err, users) {
        if (err) {
            return console.error(err);
        } else {
            //JSON response will show all users in JSON format
            res.json(users);
        }
    });
});

router.post("/:userid/contacts", function (req, res) {
    var contacts: chat.Contact[] = req.body.contacts;
    User.findByIdAndUpdate(req.params.userid,
        {
            $addToSet: {
                "contacts": {
                    $each: contacts
                }
            }
        },
        { new: true },
        function (err, user) {
            if (err) {
                return console.error(err);
            } else {
                for (let contact of contacts) {
                    User.findByIdAndUpdate(contact._id,
                        {
                            $addToSet: {
                                "contacts": {
                                    _id: user._id,
                                    name: user.name,
                                    avatar: user.avatar,
                                    email: user.email
                                }
                            }
                        },
                        { new: true },
                        function (err, user) {
                            if (err) {
                                return console.error(err);
                            }
                        });
                }
                res.json(user);
            }
        });
})

export = router;