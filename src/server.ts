import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as session from 'express-session';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as mongoose from 'mongoose';
import * as connectMongo from 'connect-mongo';
import * as socketio from 'socket.io';

// *** EXPRESS *** //
const app = express();
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/assets/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride());

// *** MONGOOSE *** //
var mongoStore = connectMongo(session);
mongoose.connect('mongodb://localhost/chat');

// *** AUTHENTICATION *** //
app.use(session({
    secret: 'secretword',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { httpOnly: true, maxAge: 2419200000 }
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure passport-local to use user model for authentication
var User = require('./models/user');
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// *** ROUTES *** //
const routes = require("./routes/index");
const users = require("./routes/users");
const conversations = require("./routes/conversations");
app.use('/', routes);
app.use('/users', users);
app.use('/conversations', conversations);
app.use(express.static(path.join(__dirname, 'public')));

// *** ERROR HANDLER *** //
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

// *** SOCKET.IO *** //
var server = http.createServer(app);
var io = socketio(server);
io.on("connection", function (socket) {
    socket.on("chatMessage", function (msg: string) {
        io.emit("chatMessage", msg);
    });
});

// *** START SERVER *** //
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
