// 得到Schema对象
const {Schema} = require("../database/connect")
// 声明ObjectId
const ObjectId = Schema.Types.ObjectId

const commentSchema = new Schema({
    content: String,
    author: {
        type: ObjectId,
        ref: 'users'
    },
    article: {
        type: ObjectId,
        ref: 'articles'
    }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "createTime",
        updatedAt: "updateTime"
    }
})

module.exports = commentSchema