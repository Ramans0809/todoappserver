const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"Password must be 8 character"],
       select:false
    },
    avatar:{
        public_id:String,
        url:String
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    tasks:[
        {
        title:String,
        description:String,
         completed:Boolean,
        createdAt:Date
    }
    ],
    otp:Number,
    otp_expiry:Date,
    resetPasswordotp:Number,
    resetPasswordotpexpire:Date,
    verified:{
        type:Boolean,
        default:false
    }
    
})

UserSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})

UserSchema.methods.getJwtToken=function(){
  return jwt.sign({_id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_COOKIE_EXPIRE *24*60*60*1000,
  })
}

UserSchema.methods.comparepassword=async function(password){
  return await bcrypt.compare(password,this.password)
}

UserSchema.index({otp_expiry:1},{expireAfterSeconds:0})






module.exports=User=mongoose.model('User',UserSchema)