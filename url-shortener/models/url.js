const mongoose = require("mongoose")
const Schema = mongoose.Schema

const urlSchema = new Schema({
    shortUrl: { type: String, required: true },
    originalUrl: { type: String, required: true }
})

module.exports = mongoose.model("Url", urlSchema)