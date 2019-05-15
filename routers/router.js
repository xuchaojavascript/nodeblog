const Router = require('koa-router')
const router = new Router
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')
const upload = require('../utils/upload')
const index = require('../control/index')
const logreg = require('../control/logreg')
// // 主页
// router.get('/', user.keepLogin, article.getList)
// // 
// router.get(/^\/user\/(reg|login)/, async (ctx) => {
//     const show = /(reg)$/.test(ctx.path)
//     await ctx.render('register', {show})
// })
// // 用户注册
// router.post('/user/reg', user.reg)
// // 用户登录
// router.post("/user/login", user.login);
// // 退出登录
// router.get("/user/logout", user.logout);
// // 文章发表跳转
// router.get("/article", user.keepLogin, article.addPage);
// // 文章发表
// router.post("/article", user.keepLogin, article.add);
// // 分页路由
// router.get("/page/:id", article.getList)
// // 文章详情页
// router.get("/article/:id", user.keepLogin, article.details)
// // 发表评论
// router.post("/comment", user.keepLogin, comment.publish);

// // 图片上传
// router.post("/upload", user.keepLogin, upload.single('file'), user.unload);

// 处理根路由
//-------------------vue结合(前后端分离)---------------
// 获取文章分页列表
router.get('/article/getlist', article.getList)
// 用户登录
router.post("/user/login", user.login);
// 用户注册
router.post("/user/reg", user.reg);
// 判断是否为登录状态
router.get('/user/isNew', user.isNew)
// 退出登录
router.get('/user/logout', user.logout)
// 文章发表
router.post("/article/post", article.add);
// 获取文章详情
router.get("/article/detail/:id", comment.getdetail)
// 发表评论
router.post("/comment", comment.publish);
// 获取所有用户信息
router.get("/user/list", admin.getUserList);
// 获取所有（或某用户）文章列表
router.get("/article/list", admin.getArticleList);
// 获取所有（或某用户）评论列表
router.get("/comment/list", admin.getComentList);
//---------------------分割线-----------------
// router.get('/', index.getIndex, async (ctx) => {
    // session
    
    // 文章列表
// })
// 注册登录页面
// router.get(/^\/user\/(reg|login)/, user.index, async (ctx) => {
//     router.get("/user/islogin", user.isLogin);
    
//     router.post("/user/reg", user.reg);
// })
// // 退出登录
// router.get('/user/logout', user.logout)
// // 跳转发表页面
// router.get('/article', article.addArtPage, async (ctx) => {
//     router.get("/user/isNew", user.isNew)
//     router.post('/article', article.add)
// })
// router.get('/article/detail/:id', comment.details, async (ctx) => {
//     router.get("/user/isNew", user.isNew)
//     router.get("/article/getartinfo", comment.getdetail)
//     router.post('/comment', comment.publish) 
// })
// 个人中心
// router.get("/admin/:id", user.keepLogin, admin.index);
module.exports = router;
