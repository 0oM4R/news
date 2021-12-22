const connection = require("../DB/connection");
const userModel = require("../Model/reporterSchema");
const multer = require('multer')
const allUsers = async (req, res) => {
  await userModel
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
};
const addUser = async (req, res) => {
  
    const user = new userModel(req.body);
    try{
        const token =  await user.creatToken()
        res.status(200).send(token);
    }
      catch(error)  {
        res.status(400).send(error.message);
      };
};


const getById = async(req,res)=>{
    // console.log(req.params) 
    // console.log(req.params.id)
    const _id = req.params.userId
    userModel.findById(_id).then((user)=>{
        // console.log(user)
        if(!user){
            return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }).catch((error)=>{
        res.status(500).send(error)
    })
}

const updateUser = async (req, res) => {
  const allow = ["email", "password"];
  const fields = Object.keys(req.body);
  const valid = fields.every((field) => allow.includes(field));

  if (valid) {
    try {
      const id = req.params.userId;
    
      const user = await userModel.findById(id);

      if (!user) {
        return res.status(400).send("No user founeded");
      }
      fields.forEach((element) => (user[element] = req.body[element]));
      //accessing object value by brackets cause I'm not sure that the key is exist
      await user.save();
      res.status(200).send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  } else {
    const notAllowed = fields.filter((field) => !allow.includes(field));
    res.status(400).send(`you can't ediet ${notAllowed} field`);
  }
};

const deleteUser = (req, res) => {
  userModel
    .findByIdAndDelete(req.params.userID)
    .then((data) => {
      if (data) {
        res.send(`user with id: ${req.params.userID} has been deleted`);
      } else {
        res.status(400).send(`user id: ${req.params._id} Not Found`);
      }
    })
    .catch((e) => {
      res.status(500).send(e);
    });
};
const login = async(req, res) => {
  try {
    const user= await userModel.findByCredentials(req.body.email, req.body.password)
    const token =await user.creatToken()
    res.status(200).send({user,token});
  }catch (err) {
    res.status(500).send(err.message);
  }
}
const logout = async (req, res) => {
  try {
    req.user.tokens=req.user.tokens.filter((el) => {
      
      return el !== req.token
    })
    await req.user.save();
    res.status(200).send('Logout success')
  }catch (err) {
    res.status(500).send(err.message);
  }
}
 const logoutAll= async (req, res) => {
   try{
      req.user.tokens= req.user.tokens=[];
      await req.user.save();
      res.status(200).send("loged out from all devices");
    }
    catch(err){
      res.status(500).send(err.message);
    }

 }
 const uploads = multer({
  limits:{
      fileSize:1000000
  },
  fileFilter(req,file,cb){
      if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
          cb(new Error('Please upload image'))
      }
      cb(null,true)
  }
})
const avatar= async(req,res)=>{
  try{
      req.user.avatar = req.file.buffer
      await req.user.save()
      res.status(200).send()
  }
  catch(e){
      res.status(400).send(e)
  }
}
 

module.exports = { allUsers, addUser, getById, updateUser, deleteUser,login ,logout,logoutAll,avatar,uploads };