// 引用Express與Express路由器
const express = require("express")
const router = express.Router()
const home = require("./modules/home") // 引入home模組程式碼
const restaurants = require("./modules/restaurants") // 引入restaurants模組程式碼

// 準備引入路由模組
router.use("/", home) // 將網址結構符合"/"字串的request導向home模組
router.use("/restaurant", restaurants) // 將網址結構符合"/restaurant"字串的request導向restaurants模組

// 匯出路由器
module.exports = router