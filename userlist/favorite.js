const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const POSTER_URL = BASE_URL + "/posters/"

const dataPanel = document.querySelector("#data-panel")
const users = JSON.parse(localStorage.getItem("favoriteUsers"))
const paginator = document.querySelector("#paginator")

const USERS_PER_PAGE = 24

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
      <button class="btn btn-danger btn-remove-favorite" data-id="${parseInt(user.id)}" data-bs-dismiss="modal">x</button>
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    `
    modalFooter.innerHTML = htmlFooter
    modalDetail.innerHTML = htmlContent

    // 在modal中加入監聽「加入我的最愛」功能    
    const modalRemoval = document.querySelector(".btn-remove-favorite")
    modalRemoval.addEventListener("click", function onFavoriteClicked(event) {
      const eventId = parseInt(event.target.dataset.id)
      removeFromFavorite(eventId)
    })
    
  }).catch(error => console.log(error))
}

function removeFromFavorite(id) {

    // 防止users是空陣列的狀況
    if (!users || !users.length) return

    // 根據該id找到此使用者，並找出在users陣列中的位置
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) return
    users.splice(userIndex, 1) // 將該使用者從陣列中刪除

    // 更新local storage
    localStorage.setItem("favoriteUsers", JSON.stringify(users))
    renderPaginator(users.length)
    renderUserList(getUsersByPage(1))
}

function getUsersByPage(page) {
  // page 1 -> movie 0-11
  // page 2 -> movie 12-23
  // page 3 -> movie 24-35
  const startIndex = (page - 1) * USERS_PER_PAGE
  return users.slice(startIndex, startIndex+USERS_PER_PAGE)
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

dataPanel.addEventListener("click", function onPanelClicked(event) {
    const eventId = parseInt(event.target.dataset.id)
    if (event.target.matches(".btn-show-user")) {
        showUserModal(eventId)
    }
})

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return
  const page = parseInt(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

renderPaginator(users.length)
renderUserList(getUsersByPage(1))