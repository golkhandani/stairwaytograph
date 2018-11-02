// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
const { host,port,serviceURL, env } = require('./config/vars');
const app = require('./config/express');
const mongoose = require('./config/mongo');


// open mongoose connection
mongoose.connect(app);

// listen to requests
app.on('ready', function() {
    app.listen(port, () => (console.log(`Visit ${host}:${port}${serviceURL}/ping`)));
});


/**
 * Exports express
 * @public
 */
module.exports = app;