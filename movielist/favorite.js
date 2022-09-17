const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const dataPanel = document.querySelector("#data-panel")
const paginator = document.querySelector("#paginator")
const movies = JSON.parse(localStorage.getItem("favoriteMovies"))
const MOVIES_PER_PAGE = 12

function renderMovieList(data) {
    let htmlContent = ""
    data.forEach(item => {
        htmlContent += `
        <div class="col-sm-3">
            <div class="mb-2">
                <div class="card">
                    <img src=${POSTER_URL+item.image} class="card-img-top" alt="Movie poster">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                    </div>
                    <div class="card-footer text-center">
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
                    </div>
                </div>
            </div>
        </div>
    `
    })
    dataPanel.innerHTML = htmlContent
}

function showMovieModal(id) {
    const title = document.querySelector("#movie-modal-title")
    const image = document.querySelector("#movie-modal-image")
    const date = document.querySelector("#movie-modal-date")
    const description = document.querySelector("#movie-modal-description")

    axios.get(INDEX_URL + id).then(response => {
        const data = response.data.results
        title.innerText = data.title
        date.innerText = "Release date: " + data.release_date
        description.innerText = data.description
        image.innerHTML = `
            <img src="${POSTER_URL+data.image}" class="img-fluid alt="Movie poster">
        `
    }).catch(error => console.log(error))
}

function removeFromFavorite(id) {

    // 防止movies是空陣列的狀況
    if (!movies || !movies.length) return

    // 根據該id找到此電影，並找出在movies陣列中的位置
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return
    movies.splice(movieIndex, 1) // 將該電影從陣列中刪除

    // 更新local storage
    localStorage.setItem("favoriteMovies", JSON.stringify(movies))
    renderPaginator(movies.length)
    renderMovieList(movies)
}

function getMoviesByPage(page) {
    // page 1 -> movie 0-11
    // page 2 -> movie 12-23
    // page 3 -> movie 24-35
    const startIndex = (page - 1) * MOVIES_PER_PAGE
    return movies.slice(startIndex, startIndex+MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
    const numOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    let htmlContent = ""
    for (let page=1; page<=numOfPages; page++) {
        htmlContent += `
            <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
        `
    }
    paginator.innerHTML = htmlContent
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
    const eventId = parseInt(event.target.dataset.id)
    if (event.target.matches(".btn-show-movie")) {
        showMovieModal(eventId)
    } else if (event.target.matches(".btn-remove-favorite")) {
        removeFromFavorite(eventId)
    }
})

paginator.addEventListener("click", function onPaginatorClicked(event) {
    if (event.target.tagName !== "A") return
    const page = parseInt(event.target.dataset.page)
    renderMovieList(getMoviesByPage(page))
})

renderPaginator(movies.length) // 抓出全部電影總共有幾部並用分頁器切開
renderMovieList(getMoviesByPage(1)) // 預設先顯示第一頁的電影清單