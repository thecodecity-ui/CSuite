const mongoose = require('mongoose')

const CourseListSchema = mongoose.Schema(

    {
        id :{
            type : Number ,
            required : [true, 'ID field required']
        },
        title :{
            type : String ,
            required : [true, 'title field required']
        },
        description:{
            type : String ,
            required : [true, 'description field required']
        },
        image :{
            type : String ,
            required : [true, 'image field required']
        },
        lessons :{
            type : Array ,
            required : [true, 'lessons field required']
        },
            
        
    }
)


const CourseList = mongoose.model("CourseList",CourseListSchema)

module.exports = CourseList