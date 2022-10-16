// 引用Express與Express路由器
const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant") // 載入Restaurant model
const sorting = require("../../utilities/sort")

// 定義首頁路由
router.get("/", (req, res) => {
    const sortCondition = { name: "asc" }
    const sortBy = {
        isNameAsec: true,
        isNameDsec: false,
        isCategory: false,
        isLocation: false,
    }
    Restaurant.find() // 取出Restaurant model裡的所有資料
        .lean() // 把Mongoose的Model物件轉換成乾淨的JavaScript資料陣列
        .sort(sortCondition)
        // .then(restaurants => console.log(restaurants))
        .then(restaurants => res.render("index", { restaurants: restaurants, keyword: "", sortBy: sortBy })) // 將資料傳給index樣板
        .catch(error => console.error(error)) // 錯誤處理
})

router.get("/search", (req, res) => {
    const keywordByUser = req.query.keyword
    const keyword = req.query.keyword.trim().toLowerCase()
    const sortby = req.query.sortby
    const [sortCondition, sortBy] = sorting(sortby)
    Restaurant.find()
        .sort(sortCondition)
        .lean()
        .then(restaurants => {
            const filterRestaurants = restaurants.filter(
                data => {
                    return data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
                }
            )
            res.render("index", { restaurants: filterRestaurants, keyword: keywordByUser, sortBy: sortBy })
        })
        .catch(error => console.log(error))
})

// 匯出路由器
module.exports = router