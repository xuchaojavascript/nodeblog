// 得到Schema对象
const {Schema} = require("../database/connect")
// 声明ObjectId
const ObjectId = Schema.Types.ObjectId

const articleSchema = new Schema({
    title: String,
    tips: String, //文章分类
    content: String,
    author: {
        type: ObjectId,
        ref: 'users'
    },
    commentNum : Number  //评论
}, {
    versionKey: false,
    timestamps: {
        createdAt: "createTime",
        updatedAt: "updateTime"
    }
})

module.exports = articleSchema