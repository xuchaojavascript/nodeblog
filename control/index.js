const fs = require('fs')

// 处理根路由
exports.getIndex = async (ctx, next) => {
    await new Promise((res, rej) => {
        fs.readFile('views/index.html', "utf-8", (err, data) => {
            if(err) rej(err)
            res(data);
        });
    }).then((data) => {
        ctx.body = data;
    }, (err) => console.log(err))
    
    await next()
}
exports.banner = async (ctx) => {
    ctx.body = '111';
}