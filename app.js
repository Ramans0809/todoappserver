const express=require("express")
const cookieparser=require("cookie-parser")
const app=express()
const userroutes=require("./routes/userroutes")
const fileUpload = require("express-fileupload")
const cors=require("cors")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieparser())
app.use(fileUpload({
    limits:{fieldSize:50*1024*1024},
    useTempFiles:true
}))

app.use(cors())
app.use('/api/v1',userroutes)

module.exports=app