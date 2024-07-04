const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema(

    {
        firstname :{
            type : String ,
            required : [true, 'Firstname field required']
        },
        lastname :{
            type : String ,
            required : [true, 'Lastname field required']
        },
        email:{
            type : String ,
            required : [true, 'Email field required']
        },
        companyname :{
            type : String ,
            required : [true, 'CompanyName field required']
        },
        message :{
            type : String ,
            required : [true, 'Message field required']
        },
        
        //    createdat : { 
        
        //     timestamps: true
           
        // }
        
        
    }
)


const Contact = mongoose.model("Contact",ContactSchema)

module.exports = Contact