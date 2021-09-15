const mongoose = require('mongoose');

const connect_DB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useFindAndModify: false
        })
        console.log(`DataBase Connected Successfully: ${conn.connection.host}`)
    }catch(err) {
        console.error(err)
        process.exit(1)
    }
}

module.exports = connect_DB;