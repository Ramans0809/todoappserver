const nodemailer=require("nodemailer")


const sendmail=async (email,subject,text)=>{
   
    const transport=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:'localtest0809@gmail.com',
            pass:process.env.MAIL_PASS
        }
    })

    await transport.sendMail({
        from:'localtest0809@gmail.com',
        to:email,
        subject,
        text
    })
}

module.exports=sendmail