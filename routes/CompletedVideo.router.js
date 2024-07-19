const Router = require('express')
const CourseDetail = require('../models/CourseDetails.model')
const CompletedVideoModel = require('../models/CompletedVideo.model')

const CompleteVideo = Router()


CompleteVideo.get('/:userId/:courseId', async(req,res)=>{
    try{
        const {userId , courseId} = req.params
        completedUserData = await CompletedVideoModel.find({userId : userId , courseId : courseId})
        if(completedUserData.length != 0){
            res.status(200).json({success:true , completedUserData : completedUserData })
        }
        else{
            res.status(404).json({success:false  , message : "Data Not Found"})
        }
    }catch(e){
        res.status(400).json({success:false , error : e.message , message : "Bad Request"})
    }
   
})


CompleteVideo.post('/', async(req,res)=>{
    try{

        const completedUserData = await CompletedVideoModel.create(req.body)

        res.status(200).json({success:true , completedUserData : completedUserData,message : "Created Successfully" })
    }catch(e){
        res.status(400).json({success:false , error : e.message , message : "Bad Request"})
    }
    
    
})



CompleteVideo.put('/:id/updatelesson', async (req,res)=>{
    try{

        const {id} = req.params
        const lesson = req.body.lesson
        existedData = await CompletedVideoModel.findById(id)
        if (existedData){

            existedArray = existedData.completedVideos
            let UpdatedData = "Lesson Already completed"
            if (!existedArray.includes(lesson)){
                
                existedData.completedVideos.push(lesson)
                UpdatedData = await CompletedVideoModel.findByIdAndUpdate(id,existedData)
            }
            console.log(existedArray.includes(lesson))
            
            res.status(200).json({success:true, UpdatedData : UpdatedData})
        }else{
            res.status(404).json({success:false  , message : "Data Not Found"})
  
        }
}catch(e){
    res.status(400).json({success:false , error : e.message , message : "Bad Request"})
}
    
})


module.exports = CompleteVideo