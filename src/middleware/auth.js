const jwt = require("jsonwebtoken")
const User = require("../models/user")
const userAuth = async (req, res, next) => {
  // read the token from the req cookie
  try {
    const { token } = req.cookies
    //console.log(token)
    if (!token) {
      return res.status(400).send("Please login first")

    }

    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET)
    const { _id } = decodedObj
    const user = await User.findById(_id)
    if (!user) {
      throw new Error("User not found");

    }
    req.user = user
    next()
  } catch (err) {
    res.status(400).send("ERROR :" + err.message)

  }
  // find the user
}
module.exports = { userAuth }