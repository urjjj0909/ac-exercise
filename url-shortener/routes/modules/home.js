// 引用Express與Express路由器
const express = require("express")
const router = express.Router()
const Url = require("../../models/url") // 載入Url model
const shortenUrl = require("../../utilities/shorten")

// 定義首頁路由
router.get("/", (req, res) => {
    res.render("index")
})

// 定義表單處理路由
router.post("/", (req, res) => {
    if (!req.body.url) { return res.redirect("/") }
    const shortUrl = shortenUrl(5) // 呼叫函式進行url亂數改寫

    // 至資料庫中找是否有該筆做過的資料
    Url.findOne({
        originalUrl: req.body.url
    })
    .then(data => data ? data : Url.create({ shortUrl: shortUrl, originalUrl: req.body.url })) // 若無則在資料庫中建立該筆新資料
    .then(data => {
        // console.log(data)
        // console.log(req.headers.origin)
        res.render("index", { origin: req.headers.origin, shortUrl: data.shortUrl }) // req.headers.origin為客戶請求端的網址
    })
    .catch(error => console.error(error))
})

router.get("/:shortUrl", (req, res) => {
    const { shortUrl } = req.params

    // 至資料庫中找是否有該筆做過的資料
    Url.findOne({
        shortUrl: shortUrl
    })
    .then(data => {
        
        // 假設無任何資料則渲染錯誤頁面
        if (!data) {
            return res.render("error", {
                errorMsg: "Can't find the url",
                errorUrl: req.headers.host + "/" + shortUrl
            })
        }
        res.redirect(data.originalUrl) // 否則導向縮短前的原網址
    })
    .catch(error => console.error(error))
})


// 匯出路由器
module.exports = router