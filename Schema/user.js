// 得到Schema对象
const {Schema} = require("../database/connect")

const userSchema = new Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: "/avatar/img1.jpg"
    },
    role : {
        type : Number,
        default : 1   //1代表普通用户  
    }
}, {
    versionKey: false
})

module.exports = userSchema