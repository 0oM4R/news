const mongoose =require('mongoose')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const reporterSchema= mongoose.Schema({
    name :{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        default: 0
    },
    email:{
        type: String,
        unique: true,
        lowercase:true,
        validate(value){
          if(!validator.isEmail(value)){
              throw new Error("Invalid email")
          } 
        }
    },
    phone:{
        type: String,
        required: true,  validate(value){
          if(!validator.isMobilePhone(value,'ar-EG' )){
              throw new Error("Invalid email")
          } 
        }
    },
    password:{
        type: String,
        required: true,
      
    },
    thumbnail:{
        type:Buffer
    },
    tokens:[
      {
        type: String,
        required: true 
      }
    ],
    postedNews:[
        {
            type:mongoose.Types.ObjectId,
            ref : 'News'
        }
    ]

})

reporterSchema.virtual('news',{
  ref:'News',   // model build realstionship 
  localField:'_id',   // 
  foreignField:'publisher'
})


reporterSchema.methods.toJSON = function(){
    const reporter = this 
    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens
    return reporterObject;
  }
  
  reporterSchema.pre("save", async function (next) {
      if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
      }
      next();
    });
  
  reporterSchema.statics.findByCredentials = async function(email, password) {
     const reporter = await this.findOne({ email });
  
      if(!reporter) {
        throw new Error("Unable to login please check your email or password");
       
  
      }
      const isMatch = await bcrypt.compare(password, reporter.password);
      if(!isMatch) {
          throw new Error("Unable to login please check your email or password");
      }
      return reporter;
    };

    reporterSchema.methods.creatToken = async function(){
  
      const token =  jwt.sign({_id:this._id.toString()},"secretKey");
      this.tokens=  this.tokens.concat(token);
      
      await this.save();
   
     return token ;
     }
   
const reporterModel= mongoose.model('Reporter',reporterSchema);

module.exports =reporterModel;