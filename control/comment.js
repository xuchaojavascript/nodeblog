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
    console.log(ctx);
    
    let _id = ctx.request.url.split('/').pop();
    
    console.log(_id);
    
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
        title: article.title,
        article,
        comment
    }
}
exports.publish = async (ctx) => {
    console.log(ctx.request.body);
     
    //用户没登录，提示请登录
    if (ctx.session.isNew) {
        //没登录
        return ctx.body = {
            status: 0,
            msg: "请登录"
        };
    }
    console.log(ctx.request.body);
    
    let comment = ctx.request.body;
    comment.author = ctx.session.userId;

    
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