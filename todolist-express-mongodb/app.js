const express = require("express")
const app = express()
const mongoose = require("mongoose") // 載入 mongoose

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

const db = mongoose.connection

db.on("error", () => {
    console.log("mongodb error!")
})

db.once("open", () => {
    console.log("mongodb connected!")
})

app.get("/", (req, res) => {
    res.send("hello world")
})

app.listen(5000, () => {
    console.log("App is running on http://localhost:5000")
})