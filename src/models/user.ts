import mongoose = require('mongoose');
import passportLocalMongoose = require('passport-local-mongoose');

var Schema = mongoose.Schema;

// create User Schema
var UserSchema = new Schema({
    email: String,
    name: String,
    avatar: { type: String, default: "/assets/img/ghosty.png" },
    facebook: {
        id: String,
        email: String,
    },
    contacts: [
        {
            email: String,
            name: String,
            avatar: String
        }
    ]
});

var options = {
    usernameField: "email"
};

UserSchema.plugin(passportLocalMongoose, options);
interface UserModel extends chat.User, mongoose.PassportLocalDocument { }
var User = mongoose.model<UserModel>('User', UserSchema);

export = User;