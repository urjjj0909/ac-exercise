// Require express & handlebars module in the project.
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = 5000
const exphbs = require("express-handlebars")
const Todo = require("./models/todo") // 載入Todo model
const bodyParser = require("body-parser") // 引用body-parser
const methodOverride = require("method-override") // 引用body-parser
const routes = require("./routes") // 引用路由器

// 規定每一筆請求都需要透過body-parser進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 由於瀏覽器在form中僅看得懂POST方法，規定由form送出的每一筆請求都需要透過method-override將路由導到PUT和DELETE
app.use(methodOverride("_method"))

// Setting template engine.
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

db.on("error", () => {
    console.log("mongodb error!")
})

db.once("open", () => {
    console.log("mongodb connected!")
})

// 將request導入路由器
app.use(routes)

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})