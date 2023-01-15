const app=require("./app")
const dotenv=require("dotenv")
const mongoose=require("mongoose")
const cloudinary=require("cloudinary")




dotenv.config({
    path:"./config/config.env"
})

cloudinary.config({
    cloud_name:"dtg40vnf7",
   api_key:"485743673126477",
   api_secret:"9sYpQg7LtbfQfr6gOjzBIn7C_BM"
})


mongoose.connect(process.env.MONGOURI,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>console.log("db connected")).catch((err)=>console.log(err))



app.listen(process.env.PORT,()=>{
    console.log(`server started on ${process.env.PORT}`)
})