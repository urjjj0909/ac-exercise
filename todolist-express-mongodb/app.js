// Require express & handlebars module in the project.
const express = require("express")
const mongoose = require("mongoose")
const app = express()
const port = 5000
const exphbs = require("express-handlebars")
const Todo = require("./models/todo") // 載入Todo model
const bodyParser = require("body-parser") // 引用body-parser

// 用app.use規定每一筆請求都需要透過body-parser進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

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

app.get("/", (req, res) => {
    Todo.find() // 取出 Todo model 裡的所有資料
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
        .then(todos => res.render("index", { todos: todos })) // 將資料傳給 index 樣板
        .catch(error => console.error(error)) // 錯誤處理
})

app.get("/todos/new", (req, res) => {
    res.render("new")
})

app.post("/todos", (req, res) => {
    const name = req.body.name

    // 可以先產生物件實例，再把實例存入Todo
    // const todo = new Todo({ name: name })
    // todo.save()
    //     .then(() => res.redirect("/"))
    //     .catch(error => console.error(error))

    // 或是直接操作Todo
    Todo.create({ name: name })
        .then(() => res.redirect("/"))
        .catch(error => console.error(error))
})

app.get("/todos/:id", (req, res) => {
    const id = req.params.id
    Todo.findById(id)
        .lean()
        .then(todo => res.render("detail", { todo: todo }))
        .catch(error => console.log(error))
})

app.get("/todos/:id/edit", (req, res) => {
    const id = req.params.id
    Todo.findById(id)
        .lean()
        .then(todo => res.render("edit", { todo: todo }))
        .catch(error => console.log(error))
})

app.post("/todos/:id/edit", (req, res) => {
    const id = req.params.id
    const newName = req.body.name
    Todo.findById(id)
        .then(todo => {
            todo.name = newName
            todo.save()
        })
        .then(() => res.redirect(`/todos/${id}`))
        .catch(error => console.log(error))
})

app.post("/todos/:id/delete", (req, res) => {
    const id = req.params.id
    Todo.findById(id)
        .then(todo => todo.remove())
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
})

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`)
})