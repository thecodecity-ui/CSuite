const mongoose = require('mongoose')

const CourseDetailsSchema = mongoose.Schema(

    {
        
        title :{
            type : String ,
            required : [true, 'title field required']
        },


        overviewPoints :{
            type : Array ,
            required : [true, 'overviewPoints field required']
        },
        
        description:{
            type : String ,
            required : [true, 'description field required']
        },
        
        lessons :{
            type : Array ,
            required : [true, 'lessons field required']
        },
        
        header:{
            type : String ,
            required : [true, 'header field required']
        },
        videoUrl:{
            type : String ,
            required : [true, 'videoUrl field required']
        },
        
        whoIsThisFor :{
            type : Array ,
            required : [true, 'whoIsThisFor field required']
        },
        
        whatYouGet :{
            type : Array ,
            required : [true, 'whatYouGet field required']
        },

        syllabus:{
            type : String ,
            required : [true, 'syllabus field required']
        },

        price:{
            type : Number ,
            required : [true, 'price field required']
        },

        courseDetails :{
            type : Array ,
            required : [true, 'courseDetails field required']
        },





    }
)


const CourseDetail = mongoose.model("CourseDetail",CourseDetailsSchema)

module.exports = CourseDetail