const BASE_URL = "https://movie-list.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const paginator = document.querySelector("#paginator")
const modeSwitch = document.querySelector("#mode-switch-section")

const movies = []
const MOVIES_PER_PAGE = 12
let filteredMovies = []

// 宣告currentPage去紀錄目前分頁，確保切換模式時分頁不會跑掉且搜尋時不會顯示錯誤
let currentPage = 1

function renderMovieList(data) {

    let htmlContent = ""

    function listMode() {
        htmlContent = `<ul id="movie-list-view" class="nav nav-pills flex-column">`
        data.forEach(item => {
            htmlContent += `
                <li class="nav-item d-inline-flex border-top py-3 align-items-center justify-content-between"">
                    <h5>${item.title}</h5>
                    <div>
                        <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                        <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
                </li>
            `
        })
        htmlContent += `</ul>`
        
        return htmlContent
    }

    function cardMode() {
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
                                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `
        })
        
        return htmlContent
    }

    dataPanel.innerHTML = dataPanel.dataset.mode==="card-mode"? cardMode() : listMode()
}

function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
    const movie = movies.find(movie => movie.id === id)
    if (list.some(movie => movie.id === id)) {
        return alert("此電影已經在收藏清單中！")
    }
    list.push(movie)
    localStorage.setItem("favoriteMovies", JSON.stringify(list))
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

function getMoviesByPage(page) {

    // filteredMovies長度>0代表有使用搜尋功能，則分頁器就要拿filteredMovies的資料，否則就拿一般的movies資料
    const data = filteredMovies.length ? filteredMovies : movies
    
    // page 1 -> movie 0-11
    // page 2 -> movie 12-23
    // page 3 -> movie 24-35
    const startIndex = (page - 1) * MOVIES_PER_PAGE
    return data.slice(startIndex, startIndex+MOVIES_PER_PAGE)
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

// 依data-mode切換不同的顯示方式
function changeDisplayMode(displayMode) {
    if (dataPanel.dataset.mode === displayMode) return
    dataPanel.dataset.mode = displayMode
}

// 監聽切換事件
modeSwitch.addEventListener("click", function onModeClicked(event) {
    if (event.target.matches("#show-movie-card")) {
        changeDisplayMode("card-mode")
        renderMovieList(getMoviesByPage(currentPage))
    } else if (event.target.matches("#show-movie-list")) {
        changeDisplayMode("list-mode")
        renderMovieList(getMoviesByPage(currentPage))
    }
})

dataPanel.addEventListener("click", function onPanelClicked(event) {
    const eventId = parseInt(event.target.dataset.id)
    if (event.target.matches(".btn-show-movie")) {
        showMovieModal(eventId)
    } else if (event.target.matches(".btn-add-favorite")) {
        addToFavorite(eventId)
    }
})

searchForm.addEventListener("submit", function onSearchSubmitted(event) {
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    if (!keyword.length) {
        return alert("Please use a valid string!")
    }

    // Option 1
    // let filteredMovies = []
    // for (const movie of movies) {
    //     if (movie.title.toLowerCase().includes(keyword)) {
    //         filteredMovies.push(movie)
    //     }
    // }

    // Option 2
    filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(keyword)
    )

    if (filteredMovies.length === 0) {
        return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
    }
    currentPage = 1
    renderPaginator(filteredMovies.length)
    renderMovieList(getMoviesByPage(currentPage)) // 預設顯示第1頁的搜尋結果
})

paginator.addEventListener("click", function onPaginatorClicked(event) {
    if (event.target.tagName !== "A") return
    const page = parseInt(event.target.dataset.page)
    currentPage = page
    renderMovieList(getMoviesByPage(page))
})

axios.get(INDEX_URL).then(response => {

    // Option 1
    // for (const movie of response.data.results) {
    //     movies.push(movie)
    // }

    // Option 2
    movies.push(...response.data.results)

    renderPaginator(movies.length) // 抓出全部電影總共有幾部並用分頁器切開
    renderMovieList(getMoviesByPage(currentPage)) // 預設先顯示第一頁的電影清單

}).catch(error => console.log(error))