const mongoose = require("mongoose")


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://jhakamani64:kYHpKRMxxa01FtNU@hotelbooking.v9i2z.mongodb.net/TinderApp"
    )

}
module.exports = connectDB
