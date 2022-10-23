function sorting(sortIndex) {
    const sortOptionsBool = findCategory(sortIndex)
    switch (sortIndex) {
        case "1":
            return [{ name: "asc" }, sortOptionsBool]
        case "2":
            return [{ name: "desc" }, sortOptionsBool]
        case "3":
            return [{ category: "asc" }, sortOptionsBool]
        default:
            return [{ location: "asc" }, sortOptionsBool]
    }
}

function findCategory(sortIndex) {
    const sortCollection = {
        isNameAsec: false,
        isNameDsec: false,
        isCategory: false,
        isLocation: false,
    }
    if (sortIndex === "1") {
        sortCollection.isNameAsec = true
    } else if (sortIndex === "2") {
        sortCollection.isNameDsec = true
    } else if (sortIndex === "3") {
        sortCollection.isCategory = true
    } else if (sortIndex === "4") {
        sortCollection.isLocation = true
    }
    return sortCollection
}

module.exports = sorting