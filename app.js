const Koa = require('koa')
const view = require('koa-views')
const logger = require("koa-logger")
const router = require('./routers/router')
const static = require('koa-static')
const {
  join
} = require('path')
const body = require('koa-body')
const session = require('koa-session')
const http = require('http')
const cors = require('koa2-cors')

const app = new Koa

app.keys = ["emmmm"]

// session的配置对象
const CONFIG = {
  key: 'sessionId',
  maxAge: 60 * 60 * 1000,
  overwrite: true,
  httpOnly: true, //是否被前端可见
  // signed: true
}

app
  .use(logger()) //注册日志
  .use(session(CONFIG, app)) //session
  .use(body()) //注册post解析数据的模块中间件
  // .use(static(join(__dirname, 'public')))


app
  .use(cors({
    origin: function (ctx) {
      if (ctx.url === '/test') {
        return "*"; // 允许来自所有域名请求
      }
      return 'http://localhost:8090';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  }))

app
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(3000, () => {
  console.log("项目启动，开始监听3000端口");

})
// 创建管理员用户
{
  const User = require("./module/user"); //得到操控集合的对象
  const crypto = require("./utils/encrypt"); //得到加密的方法

  User
    .find({
      username: 'admin'
    })
    .then(data => {
      if (data.length === 0) {
        new User({
            username: "admin",
            password: crypto("123"),
            role: 999
          })
          .save()
          .then(data => {
            console.log("管理员admin 密码：123");
          }, err => {
            console.log("管理员创建失败");
          })
      } else {
        //已存在
        console.log("管理员admin 密码：123");
      }
    })
}