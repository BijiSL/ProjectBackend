const mongoose=require('mongoose');
const mentorSchema=mongoose.Schema({
  name: String,
  email:{ type: String, unique: true },
  phone: String,
  password: String,
  // project:String
  projectassign: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projects' }],
})

const mentor=mongoose.model('mentors',mentorSchema);
module.exports=mentor;