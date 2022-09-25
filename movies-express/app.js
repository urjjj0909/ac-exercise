// Require express & handlebars module in the project.
const express = require("express")
const app = express()
const port = 5000
const exphbs = require("express-handlebars")
const movieList = require("./movies.json")

// Setting template engine.
app.engine("handlebars", exphbs({defaultLayout: "main"}))
app.set("view engine", "handlebars")

// Setting static files.
app.use(express.static("public"))

// Routes setting.
app.get("/", (req, res) => {
    res.render("index", {movies: movieList.results})
})

app.get("/movies/:movie_id", (req, res) => {
    const movie = movieList.results.find(movie =>
        movie.id.toString() === req.params.movie_id
    )
    res.render("show", {movie: movie})
})

app.get("/search", (req, res) => {
    const keyword = req.query.keyword
    const movies = movieList.results.filter(movie => {
        return movie.title.toLowerCase().includes(keyword.toLowerCase())
    })
    res.render("index", {movies: movies, keyword: keyword})
})

// Start and listen on the Express server.
app.listen(port, () => {
    console.log(`Express is listening on http://localhost:${port}`)
})