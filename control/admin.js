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
// 获取所所有用户信息
exports.getUserList = async (ctx) => {
	let userList = await User
	.find()
	ctx.body = {
		userList
		// session: ctx.session,
		// artList,
		// maxNum,
	}
}
// 获取所有（或某用户）文章列表
exports.getArticleList = async (ctx) => {
	let userId = ctx.request.query.userId;
	let articleList = await Article
	.find( userId ? { author: userId } : {} )
	.populate(author, "username")
	ctx.body = {
		articleList
	}
}
// 获取所有（或某用户）评论列表
exports.getComentList = async (ctx) => {
	let userId = ctx.request.query.userId;
	let comment = await Comment
	.find()
	.populate([
		{ path: 'author', select: 'username' },
		{ path: 'article', select: 'title' },
	])
	ctx.body = {
		comment
		// session: ctx.session,
		// artList,
		// maxNum,
	}
}
