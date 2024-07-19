const mongoose = require('mongoose')

const CompletedVideoSchema = mongoose.Schema({

    userId : {
        type : String ,
        required : [true , "User Id Required"]
    } , 
    courseId : {
        type : String ,
        required : [true , "Course Id Required"]
    } ,
    completedVideos : {
        type : Array ,
        required :  [false]
    }


})

const CompletedVideoModel = mongoose.model("CompletedVideo",CompletedVideoSchema)
module.exports = CompletedVideoModel