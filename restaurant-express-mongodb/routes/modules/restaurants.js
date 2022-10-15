// 引用Express與Express路由器
const express = require("express")
const router = express.Router()
const Restaurant = require("../../models/restaurant") // 載入Restaurant model

router.get("/new", (req, res) => {
    res.render("new")
})

router.get("/:restaurant_id", (req, res) => {
    const id = req.params.restaurant_id
    Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render("show", { restaurant: restaurant }))
        .catch(error => console.log(error))
})

router.post("/", (req, res) => {
    Restaurant.create(req.body)
        .then(() => res.redirect("/"))
        .catch(error => console.error(error))
})

router.get("/:restaurant_id/edit", (req, res) => {
    const id = req.params.restaurant_id
    Restaurant.findById(id)
        .lean()
        .then(restaurant => res.render("edit", { restaurant: restaurant }))
        .catch(error => console.log(error))
})

router.put("/:restaurant_id", (req, res) => {
    const id = req.params.restaurant_id
    Restaurant.findByIdAndUpdate(id, req.body)
        .then(() => res.redirect(`/restaurant/${id}`))
        .catch(error => console.log(error))
})

router.delete("/:restaurant_id", (req, res) => {
    const id = req.params.restaurant_id
    Restaurant.findByIdAndDelete(id)
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
})

// 匯出路由器
module.exports = router