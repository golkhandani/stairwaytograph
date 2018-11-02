const mongoose      =   require('mongoose');

const User_Schema = new mongoose.Schema({
    name :{
        type:String,
    }
},{
    timestamps:true,
})


module.exports.UserSchema = User_Schema
module.exports.UserModel = mongoose.model('user', User_Schema);