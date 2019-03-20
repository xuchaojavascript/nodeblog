const {db} = require("../database/connect")
const ArticleSchema = require("../Schema/article")
const objArticle = db.model("articles", ArticleSchema)

module.exports = objArticle