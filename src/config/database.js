
const mongoose = require("mongoose")

const connectDB = async () => {
    
    await mongoose.connect(process.env.CONNECTION_URI)
}
module.exports = connectDB

