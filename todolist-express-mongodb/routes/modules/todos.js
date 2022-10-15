// 引用Express與Express路由器
const express = require("express")
const router = express.Router()
const Todo = require("../../models/todo") // 載入Todo model

router.get("/new", (req, res) => {
    res.render("new")
})

router.post("/", (req, res) => {
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

router.get("/:id", (req, res) => {
    const id = req.params.id
    Todo.findById(id)
        .lean()
        .then(todo => res.render("detail", { todo: todo }))
        .catch(error => console.log(error))
})

router.get("/:id/edit", (req, res) => {
    const id = req.params.id
    Todo.findById(id)
        .lean()
        .then(todo => res.render("edit", { todo: todo }))
        .catch(error => console.log(error))
})

router.put("/:id", (req, res) => {
    const id = req.params.id
    const newName = req.body.name
    const isDone = req.body.isDone
    // const { newName, isDone } = req.body
    Todo.findById(id)
        .then(todo => {
            todo.name = newName
            todo.isDone = isDone === "on"
            todo.save()
        })
        .then(() => res.redirect(`/todos/${id}`))
        .catch(error => console.log(error))
})

router.delete("/:id", (req, res) => {
    const id = req.params.id
    Todo.findById(id)
        .then(todo => todo.remove())
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
})

// 匯出路由器
module.exports = router