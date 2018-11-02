const express = require('express');
const router = express.Router();
const {
    graphqlExpress,
    graphiqlExpress
} = require('graphql-server-express');



const controller = require('../controllers/index');




/**
 * GET 
 */
router.get('/ping', (req, res, next) => {
    res.send('pong');
});

router.post('/users', controller.addUser);
router.post('/books', controller.addBook);







const UserModel = require('../models/user.model').UserModel;
const BookModel = require('../models/book.model').BookModel;

const prepare = (o) => {
    o._id = (o._id).toString()
    return o
};
var { graphql,
     GraphQLObjectType,
     GraphQLID,
     GraphQLList,
     GraphQLSchema,
     GraphQLString } = require('graphql');

const Book = new GraphQLObjectType({
    name : 'Book',
    fields: () => ({
        _id: {
          type: GraphQLID
        },
        title: {
          type: GraphQLString
        },
        isbn: {
          type: GraphQLString,
        },
        authorIds:{
            type :new GraphQLList(GraphQLString)
        },
        authors: {
            type: new GraphQLList(User),
            resolve : async ({authorIds})=>{
                console.log("authorIds",authorIds)
                var a = []
                for (const item of authorIds) {
                    console.log("authorId",item)
                    a.push(prepare(await UserModel.findOne({_id:item}).lean()))
                }
                return a
            }
        }
      })
      
});
const User = new GraphQLObjectType({
    name : 'User',
    fields: () => ({
        _id: {
          type: GraphQLID
        },
        name: {
          type: GraphQLString
        },
        books: {
            type : new GraphQLList(Book),
            resolve : async ({_id})=>{
                return (await BookModel.find({authorIds:_id}).lean()).map(prepare)
            }
        }
      })
});
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      users: {
        type: new GraphQLList(User),
        async resolve() {
            return (await UserModel.find().lean()).map(prepare)
        }
      },
      books: {
        type: new GraphQLList(Book),
        async resolve() {
            return (await BookModel.find().lean()).map(prepare)
        }
      },
      book: {
        type: Book,
        async resolve({bookId}) {
            return (await BookModel.findOne({_id:bookId}).lean())
        }
      }
    })
});
const Schema = new GraphQLSchema({
  query: Query
});


var userQuery = `{
    users {
        name 
        books {
            title
            isbn
        } 
    } 
}`;
var booksQuery = `{
    books {
        title 
        authors { 
            name
        }
    }
}`;

var bookQuery = `{
    book {
        title 
        authors { 
            name
        }
    }
}`;
router.use('/users/all',async (req,res,next) => {
    res.send(await graphql(Schema,userQuery))
})
router.use('/books/all',async (req,res,next) => {
    res.send(await graphql(Schema,booksQuery,{userId:"5bdc2e7cb2664d0c9040c637"}))
})

router.use('/books/:bookId',async (req,res,next) => {
    res.send(await graphql(Schema,bookQuery,{bookId:"5bdc2e7cb2664d0c9040c637"}))
})

module.exports = router;