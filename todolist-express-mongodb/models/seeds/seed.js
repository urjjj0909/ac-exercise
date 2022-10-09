const mongoose = require("mongoose")
const Todo = require("./models/todo") // 載入Todo model

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

db.on("error", () => {
    console.log("mongodb error!")
})

db.once("open", () => {
    console.log("mongodb connected!")
    for (let i=0; i<10; i++) {
        Todo.create({ name: `name-${i}` })
    }
    console.log('data inserted!')
})