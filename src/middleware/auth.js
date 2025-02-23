
 const adminAuth =((req,res,next)=>{
    const token = "abcdefg"
    const isAdminAuthorized = token === "abcdefg"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request")
    }else{
        next()
    }
})

const userAuth =((req,res,next)=>{
    const token = "abcde"
    const isAdminAuthorized = token === "abcdefg"
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request")
    }else{
        next()
    }
})
module.exports = {adminAuth,userAuth}