
const Router = require('express')
const { getVideoDurationInSeconds } = require('get-video-duration')


const UploadVimeoRouter = Router() ;

const Vimeo = require('vimeo').Vimeo ;
const dotenv = require('dotenv').config()


// upload to local
const multer = require('multer')
const fs = require('fs')


let uniqueVideoName;
const storage = multer.diskStorage({
    destination : function(req,res,cb){
        cb(null,'./temp')
    },
    filename:function (req,res,cb){

        const suffix = Date.now() ;
        uniqueVideoName =  suffix +""+ res.originalname
        cb( null , uniqueVideoName)

    },
});

const upload = multer({ storage: storage });


// vimeo obj
let vimeo_client = new Vimeo(process.env.VIMEO_CLIENT_ID , process.env.VIMEO_CLIENT_SECRET , process.env.VIMEO_ACCESS_TOKEN);



UploadVimeoRouter.post('/',upload.fields([{ name: 'video' }]),async (req,res)=>{

try{



let file_name = `./temp/${uniqueVideoName}`
let video_duration = null
getVideoDurationInSeconds(file_name).then((duration) => {
  let m = Math.floor(duration / 60);
  let s = Math.floor(duration - (m * 60))
  console.log(`${m} mins ${s} sec`)
  video_duration =  `${m} mins ${s} sec`
})


console.log(req.files.video[0].originalname)

  vimeo_client.upload(
    file_name,
    {
      'name': 'test1',
      'description': 'The description goes here.'
    },
    function (uri) {
        let newurl = uri.split('/')[2]
      console.log('Your video URI is: ' + "https://vimeo.com/"+ newurl);
      res.status(200).json({success : true , videoCode : `${newurl}` , videoUrl : `https://player.vimeo.com/video/${newurl}`, duration : video_duration })
      try{
        fs.unlinkSync(`./temp/${uniqueVideoName}`)
        console.log('deleted successfully')


      }catch(e){
        console.log("file already deleted unable to deleted")
      }
    },
    function (bytes_uploaded, bytes_total) {
      var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
      console.log(bytes_uploaded, bytes_total, percentage + '%')
    },
    function (error) {
      console.log('Failed because: ' + error)
      res.status(500).json({success : false})
      fs.unlinkSync(`./temp/${uniqueVideoName}`)
      console.log('deleted successfully')

    }
  )



}catch(e){
    res.status(500).json({success:false , error : e.message})
}

})


module.exports = UploadVimeoRouter
