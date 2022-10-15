const Todo = require("../todo") // 載入Todo model
const db = require("../../config/mongoose")

db.once("open", () => {
    for (let i=0; i<10; i++) {
        Todo.create({ name: `name-${i}` })
    }
    console.log("data inserted!")
})