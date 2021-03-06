const Comment = require('../module/comment')
const Article = require("../module/article");
const fs = require('fs')

// 获取文章详情页
exports.details = async (ctx, next) => {    
    await new Promise((res, rej) => {
        fs.readFile('views/article.html', 'utf-8', (err, data) => {
            if(err) rej(err)
            res(data);
        })
    }).then((data) => {
        ctx.body = data;
    }, err => console.log(err))
    await next()
    // await ctx.render('article', {
    //     session: ctx.session,
    //     title: article.title,
    //     article,
    //     comment
    // })
}
// 文章详情页
exports.getdetail = async (ctx) => {
    
    let _id = ctx.request.url.split('/').pop();
    let article = await Article
    .findById(_id)
    .populate("author", "username")
    .then(data => data, err => err);
    
    let comment = await Comment
        .find({article: _id})
        .sort("-createTime")
        .populate("author", "username avatar")
        .then(data => data, err => err)
    ctx.body = {
        article,
        comment
    }
}
// 发表评论
exports.publish = async (ctx) => {
    console.log(ctx.request.body);

    let comment = ctx.request.body;
    
    await new Promise((res, rej) =>{
        new Comment(comment)
        .save((err, data) => {
            if(err) return rej(err)
            res()
        })
    }).then(data => {
        ctx.body = {
            comment,
            status: 1, 
            msg: "发表成功"
        }
        // 更新评论数目
        Article
            .update({_id: comment.article}, {$inc: {commentNum : 1}})
            .then(data => {
                console.log("评论数增1成功");
            }, err => console.log("评论数增1失败"));
    }, err => {
        ctx.body = {
            comment,
            status: 2,
            msg: err
        }
    })
}