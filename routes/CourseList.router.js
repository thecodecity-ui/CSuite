const {Router} = require('express')
const courseListRouter = Router()
const  CourseList= require('../models/CourseList.model')

//get courselist
courseListRouter.get('/',async(req,res)=>{
    
    try{
        data = await CourseList.find({})
        res.status(200).json({success : true ,courses : data , message : "Get request success"})

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }

})

//add a new course 
courseListRouter.post('/',async(req,res)=>{

    try{
        data = await CourseList.create(req.body)
        res.status(200).json({success : true ,courses : data , message : "Courese added successfully"})

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }


})

//edit a existing course
courseListRouter.put('/:id',async(req,res)=>{
    try{
        // data = await CourseList.create(req.body)
        // res.status(200).json({courses : data , message : "Courese added successfully"})

        const course = await CourseList.findByIdAndUpdate(req.params.id , req.body) ;
        if (!course){
            res.status(404).json({success : false ,message:"Courses Not Found"})
        }
        else{
            res.status(200).send({success : true ,message:"Successfully updated"})
        }
    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }
})

// delete a course
courseListRouter.delete('/:id',async(req,res)=>{

        try{
            const course = await CourseList.findByIdAndDelete(req.params.id);
            if(course){
                res.status(200).json({success : true ,course:course})
            }
            else{
                res.status(404).json({success : false ,message:"course Not Found"})
    
            }
    
        }
        catch(e){
            res.status(400).json({success : false ,error:e.message})
    
        }
})

module.exports = courseListRouter;