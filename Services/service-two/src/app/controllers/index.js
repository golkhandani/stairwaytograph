const UserMolel = require('../models/user.model').UserModel;
const BookModel = require('../models/book.model').BookModel;

const addUser = async (req, res, next) => {
    res.send(await UserMolel.create(req.body))
}
module.exports.addUser = addUser;

const addBook = async (req, res, next) => {
    res.send(await BookModel.create(req.body))
}
module.exports.addBook = addBook;



