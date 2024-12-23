const express=require('express');
const router=express.Router();
const bcrypt = require('bcryptjs');
const mentorModel=require('../models/mentor');
const adminModel=require('../models/admin');
const projectModel=require('../models/project');
router.use(express.json());
const jwt=require('jsonwebtoken');

function verifytoken(req,res,next){
    let token=req.headers.token;
    try{
    if(!token) throw 'unauthorized access';
    let payload=jwt.verify(token,'portal')
    if(!payload) throw 'Unauthorized access'
    next()
    }catch(error){
console.log(error);
    }

}

router.post('/login',async(req,res)=>{
    try{
        const admin=await adminModel.findOne({email:req.body.email});
        console.log("Admin:",admin);
        if(admin){
            if(admin.email==req.body.email &&
                admin.password==req.body.password)
                {
                 const payload={email:admin.email,password:admin.password};
                 const token=jwt.sign(payload,process.env.adminkey,{
                    expiresIn:"1hr"
                 });
                 return res
                 .status(200).send({message:"Login Succesful",token : token, role:"admin"});
                }else{
                    return res.status(400).send({message:"Invalid login credential"});
                }
        }

//  mentor validation
 const mentor=await mentorModel.findOne({email:req.body.email});
if(mentor){
    if(
        mentor.email==req.body.email &&
        mentor.password==req.body.password
    ){
        const payload={email:mentor.email,password:mentor.password};
        const token=jwt.sign(payload,process.env.mentorkey,{
            expiresIn:"1h",
        });
        return res.status(200).send({message:"Login Successful",token:token,role:'mentor',mentorId:mentor._id})
    }else{
        return res.status(401).send({message:"Invalid credential"})
    }}
else{
    return res.status(404).send({message:"User not found"})
}}

catch(err){
    console.log("err",err);
    res.status(500).send({message:"Internal server error"});
}});

// Add
router.post('/admin',async(req,res)=>{
    try {
        var data=req.body;
       await adminModel(data).save();
        res.status(200).send("Data added successfully");
    } catch (error) {
        res.status(400).send('Unable to added');
        
    }
})

router.post('/mentor/add',async(req,res)=>{
    try {
        var data=req.body;
        await mentorModel(data).save();
        res.status(200).send("Data added successfully");
    } catch (error) {
        res.status(400).send('Unable to added');
        
    }})
    //Get
    router.get("/mentor/get",async(req,res)=>{
        try {
            var data=await mentorModel.find();
            res.status(200).send(data);
            
        } catch (error) {
            res.status(404).send("unable to getdata");
        
        }
      
})

// Delete
router.delete("/mentor/del/:id",async(req,res)=>{
    try {
        await mentorModel.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted successfully");
    } catch (error) {
        res.status(404).send("unable to delete data");
    }
   })

//    Edit
router.put("/mentor/edit/:id",async(req,res)=>{
    try {
        await mentorModel.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).send("edited successfully");
          } catch (error) {
        res.status(404).send("unable to edit data");
   }
  })

// Project add
router.post('/project/add',async(req,res)=>{
    try {
        var data=req.body;
        await projectModel(data).save();
        res.status(200).send("Project added successfully");
    } catch (error) {
        res.status(400).send('Unable to added');
        
    }})

    // Project Get
    router.get("/project/get",async(req,res)=>{
        try {
            var data=await projectModel.find();
            res.status(200).send(data);
            
        } catch (error) {
            res.status(404).send("unable to getdata");
        
        }
      
});

// Project edit
router.put("/project/edit/:id",async(req,res)=>{
    try {
        await projectModel.findByIdAndUpdate(req.params.id,req.body);
        res.status(200).send("edited successfully");
          } catch (error) {
        res.status(404).send("unable to edit data");
   }
  })

//   Project delete
router.delete("/project/del/:id",async(req,res)=>{
    try {
        await projectModel.findByIdAndDelete(req.params.id);
        res.status(200).send("deleted successfully");
    } catch (error) {
        res.status(404).send("unable to delete data");
    }
   })


  // Fetch all projects
  router.get('/projects', async (req, res) => {
    try {
      const projects = await projectModel.findAll();
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });
  
  // Fetch all mentors
  router.get('/mentors', async (req, res) => {
    try {
      const mentors = await mentorModel.findAll();
      res.status(200).json(mentors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch mentors' });
    }
  });

//   Assign project to mentor
router.post("/assignProject",async(req,res)=>{
    const { mentor_id, project_id } = req.body;
  try {
    const mentor=await mentorModel.findById( mentor_id);
    if(!mentor){
        return res.status(404).send({message:"Mentor Not Found"});
    }
    const project=await projectModel.findById(project_id );
    if(!project){
        return res.status(404).send({message:"Project not found"});
    }
    if(project.projectassign?.toString()===mentor_id){
        return res.status(400).send({message:"Project is already assigned to another mentor"});
    }
    if(project.projectassign){
        return res.status(400).send({message:"project is already assigned to mentor"});
    }
    project.projectassign=mentor_id;
    await project.save();
    mentor.projectassign.push(project_id);
    await mentor.save();
    res.status(200).send({message:"Project assigned successfully"});
  } catch (error) {
    console.log(`Error during assignment`,error)
    res.status(500).send({message:"Internal server error"});
  }
})
 
module.exports = router;

