const mongoose =  require('mongoose')


const CalenderSchema = mongoose.Schema({
    user_id :{
        type : String ,
        required : [false, 'User Id field required']
    },
    event_title : {
        type : String ,
        required : [true, 'Event Title field required']
    },
    event_start : {
        type : Date,
        required : [true, 'Event Start Date field required']

    },
    event_end : {
        type : Date,
        required : [true, 'Event End Date field required']

    }
})


const Calender = mongoose.model('calender',CalenderSchema);


module.exports = Calender   ;