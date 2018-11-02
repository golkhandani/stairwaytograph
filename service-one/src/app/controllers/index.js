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



const prepare = (o) => {
    o._id = (o._id).toString()
    return o
}
const makeExecutableSchema = require('graphql-tools').makeExecutableSchema

const typeDefs = [`
    type Query {
        user(_id: String): User
        users: [User]
        book(_id: String): Book
        books: [Book]
    }

    type User {
        _id: String
        name: String
        books: [Book]
      }
    type Book {
        _id: String
        title: String
        isbn:String
        authorIds:[String]
        authors: [User]
      }
    `]
const resolvers = {
    Query: {
        users: async () => {
            return (await UserMolel.find().lean()).map(prepare)
        }
    },
    User: {
        books: async ({
            _id
        }) => {
            return (await BookModel.find({
                authorIds: _id
            }).lean()).map(prepare)
        }
    },
}
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

const getAllUsers = async (req, res, next) => {
    var query = {
        "query": `{
            users {
                _id
                name 
                books {
                    title
                    isbn
                } 
            } 
        }
        `
    }
return query
}
module.exports.UserGraphSchema = schema;
module.exports.getAllUsers = getAllUsers;

