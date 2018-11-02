const express           =   require('express');
const morgan            =   require('morgan');
const bodyParser        =   require('body-parser');
const compress          =   require('compression');
const methodOverride    =   require('method-override');
const cors              =   require('cors');
const helmet            =   require('helmet');
const { logs,serviceURL }          =   require('./vars');
const error             =   require('../modules').error;

const routes            =   require('../app/routes/index')

/**
 * Express instance
 * @public
 */
const app = express();

/** 
 * Define global variables
 * __stack,__line,__function
*/
// Define Global Variables
Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
Object.defineProperty(global, '__line', {
    get: function() {
        return "| LINE: " + __stack[1].getLineNumber() ;
    }
});
Object.defineProperty(global, '__function', {
    get: function() {
        return "| FUNC: " + __stack[1].getFunctionName() ;
    }
});





// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());


// mount api v3 routes
app.use(`/`, routes);

// catch 404 and forward to error handler
app.use(error.notFound);
app.use(error.handler);

module.exports = app;