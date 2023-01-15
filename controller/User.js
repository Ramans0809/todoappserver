const User =require("../models/Users");
const sendmail = require("../utils/Sendmail");
const sendToken = require("../utils/SendToken");
const cloudinary =require("cloudinary")
const fs=require("fs")
module.exports={
    register:async(req,res)=>{
        try {
            const {name,email,password}=req.body;
            const avatar=req.files.avatar.tempFilePath;
           
            let user=await User.findOne({email})
         
            if(user){
                return res.status(400).json({success:false,message:"User already exists"})
            }

            const otp=Math.floor(Math.random()*1000000);
            const mycloud=await cloudinary.v2.uploader.upload(avatar,{
                folder:"todoapp-avatars",
                width:150,
                crop:"scale"
            })

            fs.rmSync("./tmp",{recursive:true})

            user=await User.create({name,
                email,
                password,
                avatar:{
                    public_id:mycloud.public_id,
                    url:mycloud.secure_url
                },
                otp,otp_expiry:new Date(Date.now() + process.env.OTP_EXPIRE*60*1000)});
            await sendmail(email,"Verify Your Account",`Your otp is ${otp}`)

            sendToken(res,user,200,"Otp send to your Email id pls verify your account")


       
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    verify:async(req,res)=>{
        try {
            const otp=Number(req.body.otp);
       
            const user=await User.findById(req.user._id)
          
            if(user.otp !== otp || user.otp_expiry<Date.now()){
              return  res.status(400).json({success:false,message:"Invalid otp or has been expired"})
            }
            user.verified=true;
            user.otp=null,
            user.otp_expiry=null;

            await user.save()

            sendToken(res,user,200,"account verified")
        } catch (error) {
            res.status(500).json({success:false,message:error.message})
        }
    },
    login:async(req,res)=>{
        try {
            const {email,password}=req.body;
            
            let user=await User.findOne({email}).select("+password")
         
            if(!user){
                return res.status(400).json({success:false,message:"Invalid email or password"})
            }

            const ismatched= await user.comparepassword(password)

            if(!ismatched){
                return res.status(400).json({success:false,message:"Invalid email or password"})
            }
            sendToken(res,user,200,"login sucessfull")

        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },

    logout:async(req,res)=>{
        try {
           res.status(200).cookie("token",null,{
            expires:new Date(Date.now())
           }).json({success:true,message:"Logout success"})
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    addtask:async(req,res)=>{
        try {
          const {title,description}=req.body;

        const user=await User.findById(req.user._id)
         
        user.tasks.push({title,description,completed:false,createdAt:new Date(Date.now())})
          await user.save();
          res.status(200).json({success:true,message:"tasks added sucessfully"})

        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    removetask:async(req,res)=>{
        try {
          const {taskId}=req.params;

        const user=await User.findById(req.user._id)
         
    user.tasks=user.tasks.filter(task=>task._id.toString() !== taskId.toString())
          await user.save();
          res.status(200).json({success:true,message:"tasks deleted sucessfully"})

        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },

    updatetask:async(req,res)=>{
        try {
          const {taskId}=req.params;

        const user=await User.findById(req.user._id)
         
    user.task=user.tasks.find((task)=>task._id.toString()===taskId.toString())


    user.task.completed=!user.task.completed

          await user.save();
          res.status(200).json({success:true,message:"tasks updated sucessfully"})

        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    getmyprofile:async(req,res)=>{
        try {
          const user=await User.findById(req.user._id)
          sendToken(res,user,200,"welcome back")
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    updateprofile:async(req,res)=>{
        try {
          const user=await User.findById(req.user._id)
          const {name}=req.body;
          if(name){
            user.name=name
          }
          const avatar=req.files.avatar.tempFilePath;
        if(avatar){
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)

            const mycloud=await cloudinary.v2.uploader.upload(avatar,{
                folder:"todoapp-avatars",
                width:150,
                crop:"scale"
            })

            fs.rmSync("./tmp",{recursive:true})
            user.avatar={
                public_id:mycloud.public_id,
                url:mycloud.secure_url
            }
        }
        await user.save()
        res.status(200).json({success:true,message:"Profile updated sucessfullly"})


          
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    updatepassword:async(req,res)=>{
        try {
          const user=await User.findById(req.user._id).select("+password")
          const {oldpassword,newpassword}=req.body;
       
        
          const ismatch=await user.comparepassword(oldpassword)
          
          if(!ismatch){
           return res.status(400).json({success:true,message:"Old password invalid"})
          }
        user.password=newpassword;
        await user.save()
        res.status(200).json({success:true,message:"Password updated sucessfullly"})


          
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    forgotpassword:async(req,res)=>{
        try {
          
          const {email}=req.body;
        
         const user=await User.findOne({email})

         if(!user){
            return res.status(400).json({success:false,message:"invalid user"})
         }
         const otp=Math.floor(Math.random()*1000000);
        user.resetPasswordotp=otp;
        user.resetPasswordotpexpire=Date.now() + 10*60*1000;
         await user.save()

         await sendmail(email,"reset your password",`Your otp is ${otp}`)
     
        res.status(200).json({success:true,message:`otp send to ${email}`})


          
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },
    resetpassword:async(req,res)=>{
        try {
          
          const {otp,newpassword}=req.body;
        
         const user=await User.findOne({resetPasswordotp:otp,resetPasswordotpexpire:{$gt:Date.now()}})


         if(!user){
            return res.status(400).json({success:false,message:"otp expired or invalid"})
         }
         
        user.resetPasswordotp=null;
        user.resetPasswordotpexpire=null;
        user.password=newpassword
         await user.save()     
        res.status(200).json({success:true,message:"password changed sucessfully"})


          
        } catch (error) {
               res.status(500).json({success:false,message:error.message})
        }
    },


}