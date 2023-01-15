 const sendToken=(res,user,statuscode,message)=>{
    const options={
        httpOnly:true,
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000)
    }
    const userData={
        _id:user._id,
        name:user.name,
        email:user.email,
        avatar:user.avatar,
        tasks:user.tasks,
        verified:user.verified
    }
    
    const token=user.getJwtToken()

     res.status(statuscode).cookie("token",token,options).json({success:true,message,user:userData})
}

module.exports=sendToken;