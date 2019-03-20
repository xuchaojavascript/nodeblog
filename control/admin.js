const Article = require("../module/article"); //得到操控Article集合的对象
const User = require("../module/user");  //得到操控users集合对象
const Comment = require("../module/comment");
const fs = require("fs");
const {join} = require("path");

exports.index = async (ctx) => {
    console.log(111);
    if(ctx.session.isNew){
        //没登录
        ctx.status = 404;
        await ctx.render("404");
    }
    const id = ctx.params.id
    const arr = fs.readdirSync(join(__dirname, '../views/admin'))
    
    
    let bool = false

    arr.forEach(v => {
        let name = v.replace(/^(admin\-)|(\.pug)$/g, "")

        if(name === id){
            bool = true;
            return;
        }
    })

    if(bool){
        await ctx.render("./admin/admin-" + id, {
            role : ctx.session.role
        });
    }else{
        ctx.status = 404;
        await ctx.render("404");
    }
}