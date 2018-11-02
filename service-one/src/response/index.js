/**
 * @class Response
 */
class Response {

    constructor({
        data,
        status,
        developer,
        user,
    }) {
        this.data = data;
        this.developer = {
            message: developer,
            status: status
        };
        if (user) {
            this.notification = {
                message: user
            };
        }
    }
}



module.exports = Response;