const {Router} = require('express')
const contactRouter = Router()
const Contact = require('../models/Contact.model')

contactRouter.post('/', async(req,res)=>{
    try{
        // console.log(req.body)
        let contact =await Contact.create(req.body)
        res.json({success : true ,message : "Contact Form Submitted Succesfully",data : contact})

    }
    catch(e){
        res.status(400).json({success : false ,message : "Bad Request",error : e.message})

    }

})
contactRouter.get('/', async (req, res) => {
    try {
        const filters = req.query;
        const contacts = await Contact.find(filters);
        res.json({ success: true, message: "Contacts retrieved successfully", data: contacts });
    } catch (e) {
        res.status(400).json({ success: false, message: "Bad Request", error: e.message });
    }
});



module.exports = contactRouter;
