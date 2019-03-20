const crypto = require('crypto') //导入加密模块


module.exports = function(pwd, key = 'xu chao da shuai bi'){
    let hmac = crypto.createHmac("sha256", key)
    hmac.update(pwd)
    return hmac.digest('hex')//加密后的数据
}

