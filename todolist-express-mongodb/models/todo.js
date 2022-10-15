const mongoose = require("mongoose")
const schema = mongoose.Schema

const todoSchema = new schema({
    name: {
        type: String, // 資料型別是字串
        required: true // 這是個必填欄位
    },
    isDone: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Todo", todoSchema)