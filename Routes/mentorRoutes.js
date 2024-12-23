const mongoose=require('mongoose')
const express = require('express');
const multer = require("multer");
const router = express.Router();

const projectModel = require('../models/project');
const mentorModel=require('../models/mentor');
const submissionModel=require('../models/submission');
const ReferenceMaterial = require('../models/reference');
const path=require("path");

router.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require('../models/reference');
const PdfSchema=mongoose.model("references")
const upload = multer({ storage: storage });

router.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});
router.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});


//apis---------------------
router.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});




router.get('/projects/:mentorId', async (req, res) => {
  const {mentorId}=req.params;
  console.log('mentorId', mentorId);

  try {
    const mentor = await mentorModel.findById(mentorId).populate({
      path: 'projectassign',
      select: 'title',
    });
    const projectTitles = mentor.projectassign.map((project) => project.title);
    res.status(200).json(projectTitles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});



router.get('/submission/get',async(req,res)=>{
  const projects=await submissionModel.find();
  res.json(projects);
});

router.post('/submission/add',async(req,res)=>{
  const {student,status,marks,comments,projectId}=req.body;
  const newSubmission=new submissionModel({student,status,marks,comments,projectId});
  await newSubmission.save();
  res.json(newSubmission);
});

router.put('/submission/update/:id',async(req,res)=>{
  const updateSubmission=await projectModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
  res.json(updateSubmission);
});


// // Delete submission
router.delete('/submission/delete/:id', async (req, res) => {
  try {
    await projectModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

module.exports = router;
