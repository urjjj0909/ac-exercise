const Restaurant = require("../restaurants") // 載入Restaurant model
const db = require("../../config/mongoose")
const restaurantList = require("../../restaurant.json").results

db.once("open", () => {
    console.log("Loading restaurant seed script...")

    Restaurant.create(restaurantList)
        .then(() => {
            console.log("Data generated!")
            db.close()
        })
        .catch(error => console.log(error))
})