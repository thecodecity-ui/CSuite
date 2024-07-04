const {Router} = require('express')
const courseDetailsRouter = Router()
const  CourseDetail= require('../models/CourseDetails.model')

//get courselist
courseDetailsRouter.get('/',async(req,res)=>{
    
    try{
        data = await CourseDetail.find({})
        res.status(200).json({success : true ,courses : data , message : "Get request success"})

    }
    catch(e){
        res.status(500).json({success : false ,message : e.message})

    }

})

// //add a new course 
// courseDetailsRouter.post('/',async(req,res)=>{

//     try{
//         data = await CourseDetail.create(req.body)
//         res.status(200).json({success : true ,courses : data , message : "Courese added successfully"})

//     }
//     catch(e){
//         res.status(500).json({success : false ,message : e.message})

//     }


// })

// //edit a existing course
// courseDetailsRouter.put('/:id',async(req,res)=>{
//     try{
//         // data = await CourseList.create(req.body)
//         // res.status(200).json({courses : data , message : "Courese added successfully"})

//         const course = await CourseDetail.findByIdAndUpdate(req.params.id , req.body) ;
//         if (!course){
//             res.status(404).json({success : false ,message:"Courses Not Found"})
//         }
//         else{
//             res.status(200).send({success : true ,message:"Successfully updated"})
//         }
//     }
//     catch(e){
//         res.status(500).json({success : false ,message : e.message})

//     }
// })

// // delete a course
// courseDetailsRouter.delete('/:id',async(req,res)=>{

//         try{
//             const course = await CourseDetail.findByIdAndDelete(req.params.id);
//             if(course){
//                 res.status(200).json({success : true ,course:course})
//             }
//             else{
//                 res.status(404).json({success : false ,message:"course Not Found"})
    
//             }
    
//         }
//         catch(e){
//             res.status(400).json({success : false ,error:e.message})
    
//         }
// })

module.exports = courseDetailsRouter;