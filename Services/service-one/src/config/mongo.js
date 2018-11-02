const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

// set mongoose Promise to Bluebird or any other promise
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    mongoose.connect(mongo.uri, {
        keepAlive: 1,
        auto_reconnect: true
    });
    process.exit(-1);
});

// print mongoose logs in dev env
if (env === 'development') {
    mongoose.set('debug', true);
}

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = (app) => {
    mongoose.connect(mongo.uri, {
        keepAlive: 1,
        auto_reconnect: true,
        useNewUrlParser: true
    });
    mongoose.connection.once('open', function() {
        // All OK - fire (emit) a ready event. 
        app.emit('ready');
    });
    return mongoose.connection;
};