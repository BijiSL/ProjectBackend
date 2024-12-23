const mongoose=require('mongoose');
const projectSchema=new mongoose.Schema({
   projectassign:{type:mongoose.Schema.Types.ObjectId,ref:"mentors"},
  title: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'mentors' },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'submissions' }],
  });

module.exports=mongoose.model('projects',projectSchema);