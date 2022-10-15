// Require express & handlebars module in the project.
const express = require("express")
const app = express()
const port = 5000
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser") // 引用body-parser
const methodOverride = require("method-override") // 引用body-parser
const routes = require("./routes") // 引用路由器

require("./config/mongoose")

// 規定每一筆請求都需要透過body-parser進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 由於瀏覽器在form中僅看得懂POST方法，規定由form送出的每一筆請求都需要透過method-override將路由導到PUT和DELETE
app.use(methodOverride("_method"))

// Setting template engine.
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }))
app.set("view engine", "hbs")

// 將request導入路由器
app.use(routes)

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})