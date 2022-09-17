const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const dataPanel = document.querySelector("#data-panel")
const paginator = document.querySelector("#paginator")

const USERS_PER_PAGE = 24
const users = []
let filteredUsers = []

function renderUserList(data) {
  let htmlContent = ""
  data.forEach(item => {
    htmlContent += `
        <div class="col-sm-2">
            <div class="mb-2">
                <div class="card">
                    <img src=${item.avatar} class="card-img-top btn-show-user" alt="User avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${item.id}">
                    <div class="card-body">
                        <p class="card-title">${item.name + item.surname + item.id}</p>
                    </div>
                </div>
            </div>
        </div>
    `
  })
  dataPanel.innerHTML = htmlContent
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  const eventId = parseInt(event.target.dataset.id)
  if (event.target.matches(".btn-show-user")) {
    showUserModal(eventId)
  }
})

function showUserModal(id) {
  const modalTitle = document.querySelector("#user-modal-title")
  const modalImage = document.querySelector("#user-modal-image")
  const modalDetail = document.querySelector("#user-modal-detail")
  const modalFooter = document.querySelector("#user-modal-footer")
  let htmlContent = ""
  axios.get(INDEX_URL + id).then(response => {
    const user = response.data
    modalTitle.innerText = `${user.name} ${user.surname}`
    modalImage.innerHTML = `<img src=${user.avatar} class="img-fluid alt="User profile">`
    htmlContent += `
            <p><em id="user-modal-date"></em>Created at: ${user.created_at}</p>
            <p id="user-modal-gender">Gender: ${user.gender}</p>
            <p id="user-modal-age">Age: ${user.age}</p>
            <p id="user-modal-region">Region: ${user.region}</p>
            <p id="user-modal-birthday">Birthday: ${user.birthday}</p>
            <p id="user-modal-email">Email: ${user.email}</p>
        `
    htmlFooter = `
      <button type="button" class="btn btn-info btn-add-favorite" data-bs-dismiss="modal" data-id=${parseInt(user.id)}>Add to favorite</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `
    modalFooter.innerHTML = htmlFooter
    modalDetail.innerHTML = htmlContent

    // 在modal中加入監聽「加入我的最愛」功能    
    const modalFavorite = document.querySelector(".btn-add-favorite")
    modalFavorite.addEventListener("click", function onFavoriteClicked(event) {
      const eventId = parseInt(event.target.dataset.id)
      addToFavorite(eventId)
    })
  }).catch(error => console.log(error))
}

function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
    console.log(list)
    const user = users.find(user => user.id === id)
    if (list.some(user => user.id === id)) {
        return alert("此使用者已經在收藏清單中！")
    }
    list.push(user)
    localStorage.setItem("favoriteUsers", JSON.stringify(list))
}

searchForm.addEventListener("submit", function onSearchSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  if (!keyword.length) {
    return alert("Please use a valid string!")
  }

  function filterName(obj, keyword) {
    const nameAll = obj.name + obj.surname + obj.id
    return nameAll.toLowerCase().includes(keyword)
  }

  filteredUsers = users.filter(user => filterName(user, keyword))

  if (filteredUsers.length === 0) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的使用者`)
  }

  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1)) // 預設顯示第1頁的搜尋結果
})

function getUsersByPage(page) {

    // filteredUsers長度>0代表有使用搜尋功能，則分頁器就要拿filteredUsers的資料，否則就拿一般的users資料
    const data = filteredUsers.length ? filteredUsers : users
    
    // page 1 -> user 0-23
    // page 2 -> user 24-47
    // page 3 -> user 48-71
    const startIndex = (page - 1) * USERS_PER_PAGE
    return data.slice(startIndex, startIndex+USERS_PER_PAGE)
}

function renderPaginator(amount) {
    const numOfPages = Math.ceil(amount / USERS_PER_PAGE)
    let htmlContent = ""
    for (let page=1; page<=numOfPages; page++) {
        htmlContent += `
            <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
        `
    }
    paginator.innerHTML = htmlContent
}

paginator.addEventListener("click", function onPaginatorClicked(event) {
    if (event.target.tagName !== "A") return
    const page = parseInt(event.target.dataset.page)
    renderUserList(getUsersByPage(page))
})

axios.get(INDEX_URL).then(response => {
  
  users.push(...response.data.results)
  // console.log(response.data.results)

  renderPaginator(users.length)
  renderUserList(getUsersByPage(1)) // 預設先顯示第一頁的使用者清單
  
}).catch(error => console.log(error))