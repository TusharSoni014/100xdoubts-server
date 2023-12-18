
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI
        const DB_CONFIG = {
            dbName: "100xDoubts",
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        await mongoose.connect(uri, DB_CONFIG)
        console.log("Connected to database.")
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB
