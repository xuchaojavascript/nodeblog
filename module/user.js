const {db} = require("../database/connect")
const UserSchema = require("../Schema/user")
const objUser = db.model("users", UserSchema)

module.exports = objUser