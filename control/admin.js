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
	}
}
// 获取所有（或某用户）文章列表
exports.getArticleList = async (ctx) => {
	let userId = ctx.request.query.userId;
	let articleList = await Article
	.find( userId ? { author: userId } : {} )
	.populate('author', "username")
	ctx.body = {
		articleList
	}
}
// 获取所有（或某用户）评论列表
exports.getComentList = async (ctx) => {
	let userId = ctx.request.query.userId;
	let commentList = await Comment
	.find( userId ? { author: userId } : {} )
	.populate([
		{ path: 'author', select: 'username' },
		{ path: 'article', select: 'title' },
	])
	ctx.body = {
		commentList
	}
}
// 删除用户 先删除用户所有文章中的评论 然后删除文章 再删除用户所有评论
exports.deleteUser = async (ctx) => {
	let userId = ctx.request.query.userId
	let error = ''
	// 1、查找用户的所有文章
	let articleList = await Article.find({author: userId})
	// 2、删除所有文章中的评论
	for (let index = 0; index < articleList.length; index++) {
		await Comment.deleteMany({article: articleList[index]._id})
	}
	// 3、删除文章
	await Article.deleteMany({author: userId})
	// 4、删除用户评论
	await Comment.deleteMany({author: userId})
	// 5、删除用户
	await User.deleteOne({_id: userId}, (err,res)=>{
		console.log(err);
		error = err
	})
	ctx.body = {
		msg: error ? ('删除失败，' + error) : '删除成功'
	}
}
// 删除文章
exports.deleteArticle = async (ctx) => {
	let articleId = ctx.request.query.articleId
	let error = ''
	// 1、先删除文章中的所有评论
	await Comment.deleteMany({article: articleId})
	// 2、然后再删除文章
	await Article.deleteOne({_id: articleId}, (err,res)=>{
		console.log(err);
		error = err
	})
	ctx.body = {
		msg: error ? ('删除失败，' + error) : '删除成功'
	}
}
// 删除评论
exports.deleteComment = async (ctx) => {
	let commentId = ctx.request.query.commentId
	let error = ''

	await Comment.deleteOne({_id: commentId}, (err,res)=>{
		console.log(err);
		error = err
	})
	ctx.body = {
		msg: error ? ('删除失败，' + error) : '删除成功'
	}
}
