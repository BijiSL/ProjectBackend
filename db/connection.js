const mongoose=require('mongoose');
mongoose.connect(process.env.mongourl)
.then(()=>{
    console.log('DB connected');
}).catch(()=>{
    console.log('connection lost');
})