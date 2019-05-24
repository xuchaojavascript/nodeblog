const multer = require('koa-multer')
const {join} = require('path')

const storage = multer.diskStorage({
    
    // 存放位置
    destination: join(__dirname, '../public/avatar'),
    // 文件名
    filename(req, file, cb){
       const arrFileName = file.originalname.split('.')
       cb(null, `${Date.now()}.${arrFileName[arrFileName.length - 1]}`)
    }
})
module.exports = multer({storage})