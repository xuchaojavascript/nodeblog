const {db} = require("../database/connect")
const CommentSchema = require("../Schema/comment")
const objComment = db.model("comments", CommentSchema)

module.exports = objComment