const express = require('express');
const router = express.Router();





/**
 * GET 
 */
router.get('/ping', (req, res, next) => {
    res.send('pong');
});

// router.post('/users', controller.addUser);
// router.post('/books', controller.addBook);







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
          type: GraphQLString
        },
        authorIds:{
            type :new GraphQLList(GraphQLString)
        },
        authors: {
            type: new GraphQLList(User),
            resolve : async ({authorIds})=>{
                var a = [];
                for (const item of authorIds) {
                    a.push(prepare(await UserModel.findOne({_id:item}).lean()));
                }
                return a;
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

const Mutation =new GraphQLObjectType({
    name:'Mutation',
    fields:()=>({
        CreateUser: {
            type: User,
            async resolve({body}) {
                return prepare((await UserModel.create(body)).toObject()) 
            }
          },
        CreateBook: {
            type: Book,
            async resolve({body}) {
                return prepare((await BookModel.create(body)).toObject()) 
            }
          },
    })
})

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
  query: Query,
  mutation:Mutation
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
        _id
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
var CreateUser = `mutation {
    CreateUser {
        name
        _id
    }
}`;
var CreateBook = `mutation {
    CreateBook {
        title
        _id
    }
}`;



router.get('/users/all',async (req,res,next) => {
    res.send(await graphql(Schema,userQuery))
});
router.get('/books',async (req,res,next) => {
    res.send(await graphql(Schema,booksQuery))
});
router.get('/books/:bookId',async (req,res,next) => {
    res.send(await graphql(Schema,bookQuery,{bookId:req.params.bookId}))
});
router.post('/users',async (req,res,next) => {
    res.send(await graphql(Schema,CreateUser,{body:req.body}))
});
router.post('/books',async (req,res,next) => {
    res.send(await graphql(Schema,CreateBook,{body:req.body}))
});


module.exports = router;