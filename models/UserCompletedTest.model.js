const mongoose = require('mongoose')

const UserCompletedTest = mongoose.Schema(

    {
        userId :{
            type : String ,
            required : [true, 'User Id field required']
        },
        
        testId:{
            type : String ,
            required : [true, 'testId field required']
        },
        isCompleted :{
            type : Boolean ,
            default : true,
        },
        

        score : {
            type : Number ,
            required : [true, 'score field required']
        },
        totalQuestions :{
            type : Number ,
            required : [true, 'TotalQuestions field required']
        }
    
    },

    { timestamps: true } 
)


const CompletedTest = mongoose.model("UserCompletedTest",UserCompletedTest)

module.exports = CompletedTest