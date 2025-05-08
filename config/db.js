const mongoose = require('mongoose')

const connectDb = async () => {
   await mongoose.connect(process.env.MONGO_URI).then(()=>{
       console.log("DB Connected Successfully")
   }).catch((error)=>{
       console.log(`DB Connection Failed due to ${error.message}`)
   })
}

module.exports = connectDb