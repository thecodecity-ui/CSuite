const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(

    {
        name :{
            type : String ,
            required : [true, 'Name field required']
        },
        
        email:{
            type : String ,
            required : [true, 'Email field required']
        },
        password :{
            type : String ,
            required : [true, 'Password field required']
        },
        linkedIn :{
            type : String ,
            required : [true, 'Message field required']
        },
        coursePurchased : {
            type : Array,
            required : [false, 'Message field required']

        },
        
        
        
    }
)


const User = mongoose.model("User",UserSchema)

module.exports = User