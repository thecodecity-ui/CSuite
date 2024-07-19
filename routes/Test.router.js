const express = require('express');
const testRouter = express.Router();
const Test = require('../models/Test.model');
const CompletedTest = require('../models/UserCompletedTest.model')

// Get all test data
testRouter.get('/', async (req, res) => {
  try {
    const testData = await Test.find();
    res.json(testData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

testRouter.get('/:testId', async (req, res) => {
  try {
    const testData = await Test.findById(req.params.testId);
    if (testData){
      res.status(200).json({success : true , test : testData});
    }
    
    else{
      res.status(404).json({success : false ,error: "No test Found"});
      
    }
  } catch (err) {
    res.status(500).json({ success : false , error: err.message });
  }
});




testRouter.post('/', async(req,res)=>{
  try{
      // console.log(req.body)
      let test =await Test.create(req.body)
      res.json({success : true ,message : "Payment completed ",test : test})

  }
  catch(e){
      res.status(400).json({success : false ,message : "Bad Request",error : e.message})

  }

})

testRouter.put('/:testId', async(req,res)=>{
  try{

      let test =await Test.findByIdAndUpdate(req.params.testId , req.body)
      res.json({success : true ,message : "Test Updated Successfuly ",test : test})

  }
  catch(e){
      res.status(400).json({success : false ,message : "Bad Request",error : e.message})

  }

})




// for user  completed test

// to get both test questions and user completed or not data 
testRouter.get('/:testId/user/:userId',async (req,res)=>{
  const {userId , testId} = req.params
  let userTest = await CompletedTest.find({userId : userId , testId : testId}) 
  const testData = await Test.findById(req.params.testId);

  if(userTest.length == 0){

    userTest = {
      userId : userId ,
      testId : testId,
      isCompleted : false , 

    }
  }

  if (!testData){
    res.status(404).json({success : false ,error: "No test Found"})
  }
  else{
    res.status(200).json({success : true , testData : testData , userTestData : userTest})
  }
  
  

})

// submit the answers of the user
testRouter.post('/submittest', async(req,res)=>{
  try{
      // console.log(req.body)
      let test =await CompletedTest.create(req.body)
      res.json({success : true ,message : "User Test Uploaded Successfully ",test : test})

  }
  catch(e){
      res.status(400).json({success : false ,message : "Bad Request",error : e.message})

  }

})



module.exports = testRouter;