const BASE_62_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const MIN = 0
const MAX = 61

module.exports = (shortenUrl_Length) => {
    let result = ""
    for (let i=0; i<shortenUrl_Length; i++) {
        const randomIndex = Math.floor(Math.random() * (MAX-MIN+1) + MIN) // 產生亂數 Index
        const chooseChar = BASE_62_CHAR[randomIndex] // 依照亂數表找出對應的字元
        result += chooseChar // 將對應字元放入result
    }
    return result
}