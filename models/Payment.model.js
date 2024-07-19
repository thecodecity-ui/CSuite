const mongoose = require('mongoose')

const PaymentSchema = mongoose.Schema(

    {
        userId :{

            type : String ,
            required : [true, 'Name field required']
        },
        name :{
            type : String ,
            required : [true, 'Name field required']
        },
        
        email:{
            type : String ,
            required : [true, 'Email field required']
        },

        paymentId:{
            type : String ,
            required : [true, 'paymentId field required']
        },

        // paymentDetails : {
        //     type : Object,
        //     required :  [true, 'paymentDetails field required']
        // }
        
    },

    { timestamps: true } 
)


const Payment = mongoose.model("payment",PaymentSchema)

module.exports = Payment