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



const stripe = require("stripe")("sk_test_51PUVZZRrG0ZkGYrrIq8xX3O1fcIQ4xrvYmHRM9m6oFSNjEZL0AcRnLmnAx7ZORfMLH0UwqEDQGlcFlfv7Hm7JJoN00nHLBHIxq");

async function createCheckoutSession(item) {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: item,
        mode: "payment",
        success_url: `https://csuite-academy.netlify.app/home/courseDetails/+req.body.id+?status=success`,
        cancel_url: `https://csuite-academy.netlify.app/home/courseDetails/+req.body.id+?status=failed`
    });
    return session.id;
}

module.exports = { createCheckoutSession };

