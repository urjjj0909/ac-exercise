// Require express & handlebars module in the project.
const express = require("express")
const app = express()
const port = 5000
const exphbs = require("express-handlebars")
const restaurantList = require("./restaurant.json")

// Setting template engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }))
app.set("view engine", "handlebars")

// Setting static files.
app.use(express.static("public"))

// Routes setting.
app.get("/", (req, res) => {
    res.render("index", { restaurants: restaurantList.results })
})

app.get("/restaurants/:restaurant_id", (req, res) => {
    console.log(req.params)
    const restaurant = restaurantList.results.find(restaurant =>
        restaurant.id.toString() === req.params.restaurant_id
    )
    res.render("show", { restaurant: restaurant })
})

app.get("/search", (req, res) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.results.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render("index", { restaurants: restaurants, keyword: keyword })
})

app.get("/search", (req, res) => {
    if (!req.query.keywords) {
        return res.redirect("/")
    }
})

// Start and listen on the Express server.
app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})