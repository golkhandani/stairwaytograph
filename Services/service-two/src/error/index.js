const APIResponse =require('../modules/index').response
const handler = function(err, req, res, next) {
    //Handle validation errors
    var response;
    if (err.name === 'Error') {
        console.log(err);
        var error = JSON.parse(err);
        res.status(400).json({});
    } else
    //handle other errors
    if (err) {
        console.log(err)
        response = new APIResponse({user:err.user, developer: err.message, status: err.status });
        res.status(err.status ? err.status : 507).json(response);
    }
};
exports.handler = handler;

exports.notFound = (req, res, next) => {
    next({user:'صفحه مورد نظر یافت نشد', message: 'not found', status: 404 }, req, res);
};