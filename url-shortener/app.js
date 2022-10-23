// Require express & handlebars module in the project.
const express = require("express")
const app = express()
const port = 5000
const exphbs = require("express-handlebars")
const bodyParser = require("body-parser") // 引用body-parser
const methodOverride = require("method-override") // 引用body-parser
const routes = require("./routes") // 引用路由器

require("./config/mongoose")