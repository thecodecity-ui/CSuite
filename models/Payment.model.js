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
        courseData :{
            type : [] ,
            required : [true, 'Course Data required']

        },

        paymentData:{
            type : [] ,
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



const stripe = require("stripe")("sk_test_51PSLZRI8GvQfURhs8oaALuVeKJn5YM4J5PVSh2NCp0mIhK1JlGDU3FsGl2ZXW4d3zPKb3RQkPOnQn2vEiSFnKDmX008yQ5HAhQ");

async function createCheckoutSession(item, id) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: item,
        mode: "payment",
        success_url: `https://csuiteacademy.netlify.app/home/courseDetails/`+id+`?status=success`,
        cancel_url: `https://csuiteacademy.netlify.app/home/courseDetails/`+id+`?status=failed`
    });
    return {id:session.id, couseid:id,other:session,};
}

module.exports = { createCheckoutSession };
