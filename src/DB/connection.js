const mongoose =require('mongoose');
const connection =async ()=>{
   return  await mongoose.connect('mongodb://localhost/news')
   .then(
        ()=> console.log('DB connection established')
    );
};
module.exports = connection;