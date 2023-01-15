const express=require("express")

const router=express.Router()
const auth=require("../middleware/auth")
const Usercontroller=require('../controller/User')

router.route('/register').post(Usercontroller.register)

router.route('/verify').post(auth,Usercontroller.verify)

router.route('/login').post(Usercontroller.login)

router.route('/logout').get(auth,Usercontroller.logout)

router.route('/newtask').post(auth,Usercontroller.addtask)

router.route('/task/:taskId').delete(auth,Usercontroller.removetask).get(auth,Usercontroller.updatetask)

router.route('/me').get(auth,Usercontroller.getmyprofile)

router.route('/updateprofile').put(auth,Usercontroller.updateprofile)

router.route('/updatepassword').put(auth,Usercontroller.updatepassword)

router.route('/forgotpassword').post(Usercontroller.forgotpassword)

router.route('/resetpassword').put(Usercontroller.resetpassword)





module.exports=router


