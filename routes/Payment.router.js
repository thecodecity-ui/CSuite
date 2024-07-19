const {Router} = require('express')
const paymentRouter = Router()
const Payment = require('../models/Payment.model')

paymentRouter.get('/', async(req,res)=>{
    try{
        
        let payment =await Payment.find({})
        res.json({success : true ,message : "Payment completed ",payments : payment})

    }
    catch(e){
        res.status(400).json({success : false ,message : "Bad Request",error : e.message})

    }

})

paymentRouter.get('/:id', async(req,res)=>{
    try{
        
        let payment =await Payment.findById(req.params.id)
        if(!payment){
            res.status(404).json({success : false ,message : "Payment Not Found"})

        }
        else{

            res.status(200).json({success : true ,message : "Payment completed ",payments : payment})
        }

    }
    catch(e){
        res.status(400).json({success : false ,message : "Bad Request",error : e.message})

    }

})



paymentRouter.post('/', async(req,res)=>{
    try{
        // console.log(req.body)
        let payment =await Payment.create(req.body)
        res.json({success : true ,message : "Payment completed ",data : payment})

    }
    catch(e){
        res.status(400).json({success : false ,message : "Bad Request",error : e.message})

    }

})



module.exports = paymentRouter;