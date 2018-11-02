const mongoose      =   require('mongoose');

const Book_Schema = new mongoose.Schema({
    title :{
        type:String,
    },
    isbn:{
        type:String
    },
    authorIds:[{
        type:String
    }]
},{
    timestamps:true,
})


module.exports.BookSchema = Book_Schema
module.exports.BookModel = mongoose.model('collection', Book_Schema,'books');