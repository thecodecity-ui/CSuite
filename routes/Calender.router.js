const {Router} = require('express')
const calenderRouter = Router() ;
const Calender = require('../models/Calender.model') ;


calenderRouter.get('/',async (req,res) => {

    try{
        calender =await Calender.find({})
        res.status(200).json({ success : true ,calender : calender ,message : "Get Request Success" })
    }catch(e){
        res.status(500).json({ success : false  ,error : e.message })
    }

})

calenderRouter.get('/user/:user_id',async (req,res) => {

    try{
        calender =await Calender.find({user_id :req.params.user_id})
        
        res.status(200).json({ success : true ,calender : calender ,message : "Get Request Success" })
    }catch(e){
        res.status(500).json({ success : false  ,error : e.message })
    }

})



calenderRouter.post('/',async(req,res)=>{

    try{
        calender = await Calender.create(req.body)
        res.status(200).json({success : true ,calender : calender , message : "User added successfully"})

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }


})




calenderRouter.put('/:id',async(req,res)=>{
    try{
        

        const calender = await Calender.findByIdAndUpdate(req.params.id , req.body) ;
        if (!calender){
            res.status(404).json({success : false ,message:"Calender Not Found"})
        }
        else{
            res.status(200).send({success : true ,calender : calender,message:"Successfully updated"})
        }
    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }
})



calenderRouter.delete('/:id',async(req,res)=>{

    try{
        const calender = await Calender.findByIdAndDelete(req.params.id);
        if(calender){
            res.status(200).json({success : true ,User:calender})
        }
        else{
            res.status(404).json({success : false ,message:"calender Not Found"})

        }

    }
    catch(e){
        res.status(400).json({success : false ,error:e.message})

    }
})





module.exports = calenderRouter ;


