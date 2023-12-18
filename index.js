const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const connectDB = require('./dbconnect.js')
const userRouter = require("./routes/userRouter.js")
const cookieParser = require('cookie-parser')
const app = express();
dotenv.config()
const PORT = process.env.PORT || 4000

//middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())

//debug middlewares
app.use((req, res, next) => {
    console.log("type:",req.method, ",endpoint:",req.url)
    next()
})

//routes
app.use('/user', userRouter)

//mongodb connect
connectDB()

app.listen(PORT, () => {
    console.log(`listening on port http://localhost:${PORT}`)
})