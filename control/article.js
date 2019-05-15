const Article = require('../module/article')
const Comment = require('../module/Comment')
const fs = require('fs')

// 跳转文章发表页面
exports.addArtPage = async (ctx, next) => {
    await new Promise((res, rej) => {
        fs.readFile('views/add-article.html', 'utf-8', (err, data) => {
            if(err) rej(err)
            res(data);
        })
    }).then((data) => {
        ctx.body = data;
    }, err => console.log(err))
    await next()
}

// 添加文章
exports.add = async (ctx) => {
    let data = ctx.request.body;
    await new Promise((res, rej) =>{
        new Article(data)
        .save((err, data) => {
            if(err) return rej(err)
            res()
        })
    }).then(() => {
        ctx.body = {
            status: 1, 
            msg: "发表成功"
        }
    }, err => {
        ctx.body = {
            status: 0,  
            msg: err
        }
    })
}

// 获取文章列表
exports.getList = async (ctx) => {
    let _tip = ctx.request.query.tip;
    let page = ctx.params.id || 1;
    let maxNum = await Article.estimatedDocumentCount((err, data) => {
        return err || data
    })
    // if(_tip){
    //     artList.add
    // }
    let artList = await Article
        .find( _tip ? { tips: _tip } : {} )
        .sort("-createTime")
        .skip((page-1)*5)
        .limit(5)
        .populate("author", "_id username avatar")
        .then(data => data, err => err)
    console.log(artList);
    
    ctx.body = {
        session: ctx.session,
        artList,
        maxNum,
    }
}

