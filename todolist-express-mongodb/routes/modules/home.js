// 引用Express與Express路由器
const express = require("express")
const router = express.Router()
const Todo = require("../../models/todo") // 載入Todo model

// 定義首頁路由
router.get("/", (req, res) => {
    Todo.find() // 取出Todo model裡的所有資料
        .lean() // 把Mongoose的Model物件轉換成乾淨的 JavaScript資料陣列
        .sort({ _id: "asc" })
        .then(todos => res.render("index", { todos: todos })) // 將資料傳給index樣板
        .catch(error => console.error(error)) // 錯誤處理
})

// 匯出路由器
module.exports = router