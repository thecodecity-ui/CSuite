const {Router} = require('express')
const userRouter = Router()
const  User = require('../models/User.model')

//get Users
userRouter.get('/',async(req,res)=>{
    
    try{
        data = await User.find({})
        res.status(200).json({success : true ,user : data , message : "Get request success"})

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }

})
//get user
userRouter.get('/:id',async(req,res)=>{
    
    try{
        data = await User.findById(req.params.id)
        if (!data){

            res.status(404).json({success : false , message : "User not found"})
        }
        else{

            res.status(200).json({success : true ,user : data , message : "Get request success"})
        }

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }

})

//add a new User 
userRouter.post('/',async(req,res)=>{

    try{
        data = await User.create(req.body)
        res.status(200).json({success : true ,user : data , message : "User added successfully"})

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }


})



// edit a existing user

userRouter.put('/:id',async(req,res)=>{
    try{
        

        const user = await User.findByIdAndUpdate(req.params.id , req.body) ;
        if (!user){
            res.status(404).json({success : false ,message:"user Not Found"})
        }
        else{
            res.status(200).send({success : true ,message:"Successfully updated"})
        }
    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }
})


//add a  course to user
userRouter.put('/updatecourse/:id',async(req,res)=>{

    try{
        let existingUser =  await User.findById(req.params.id)  

        if (existingUser){
            let existingcourse = existingUser.coursePurchased
            console.log(req.body.coursePurchased)
            if (req.body.coursePurchased){

                existingcourse.push(req.body.coursePurchased)
                
                console.log(existingcourse)
                let query = {
                    coursePurchased : existingcourse
                }
                
                
                const user = await User.findByIdAndUpdate(req.params.id , query) ;
                console.log("put")
                if(!user){
                    res.status(404).json({success : false ,message:"user Not Found"})
                }
                else{
                    res.status(200).send({success : true,user: user ,message:"Successfully updated"})
                }
            }
            else{

                res.status(400).json({success : false ,message:"Bad request"})
            }
            }
            else{
                res.status(404).json({success : false ,message:"User Not Found"})
            }

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }
})



// delete a user
userRouter.delete('/:id',async(req,res)=>{

        try{
            const user = await User.findByIdAndDelete(req.params.id);
            if(user){
                res.status(200).json({success : true ,User:user})
            }
            else{
                res.status(404).json({success : false ,message:"user Not Found"})
    
            }
    
        }
        catch(e){
            res.status(400).json({success : false ,error:e.message})
    
        }
})

module.exports = userRouter;