const mongoose=require('mongoose');
const referenceSchema=new mongoose.Schema({
    title:String,
    fileName:String
});
module.exports=mongoose.model('references',referenceSchema);