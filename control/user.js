const User = require('../module/user')
const crypto = require('../utils/encrypt')
const fs = require('fs')
// 登陆注册界面跳转
exports.index = async (ctx, next) => {
    await new Promise((res, rej) => {
        fs.readFile('views/register.html', 'utf-8', (err, data) => {
            if(err) rej(err)
            res(data);
        })
    }).then((data) => {
        ctx.body = data;
    }, err => console.log(err))
    await next()
}
// 判断是否跳转为登陆页面
exports.isLogin = async (ctx) => {
    let id = ctx.request.header.referer.split('/').pop()
    if(id === 'login'){
        ctx.body = true
    }else if(id === 'reg'){
        ctx.body = false
    }
}
// 登陆处理的中间件
exports.login = async (ctx) => {
    let {username, password} = ctx.request.body
    await new Promise((res, rej) => {
        User.find({username}, (err, data) => {
            // 查询报错了
            if(err) return rej(err)

            // 查询中没报错, 但是没查到数据
            if(data.length === 0)return rej(0)

            //用户名存在，比对密码是否一致
            //将用户传过来的密码加密，和数据库中中的加密密码进行比对
            if(data[0].password === crypto(password)){
                return res(data)
            }else{
                return res("") //密码错误
            }
        })
    }).then(async data => {
        if(data){
            // 设置cookie
            ctx.cookies.set("username", username, {
                // 配置cookie的属性
                domain: "localhost",
                path: "/",
                maxAge: 1000*60*60,
                httpOnly: true, //不让客户端操控，设置为不可见
                overwrite: false //不可覆盖
            })
            ctx.cookies.set("userId", data[0]._id, {
                // 配置cookie的属性
                domain: "localhost",
                path: "/",
                maxAge: 1000*60*60,
                httpOnly: true, //不让客户端操控，设置为不可见
                overwrite: false //不可覆盖
            })
            ctx.cookies.set("avatar", data[0].avatar, {
                // 配置cookie的属性
                domain: "localhost",
                path: "/",
                maxAge: 1000*60*60,
                httpOnly: true, //不让客户端操控，设置为不可见
                overwrite: false //不可覆盖
            })
            // 设置后端session
            ctx.session = {
                username,
                userId: data[0]._id,
                avatar: data[0].avatar,
                role : data[0].role
            } 
            // 登陆成功
            ctx.body = {
                status: true,
                msg: '登录成功',
                userData: ctx.session
            }
        }else{
            // 密码错误
            ctx.body = {
                status: false,
                msg: '密码错误'
            }
        }
    }, async err => {
        if(!!err){
            // 服务器错误
            ctx.body = {
                status: false,
                msg: '服务器开小差了'
            }
        }else{
            // 用户名不存在
            ctx.body = {
                status: false,
                msg: '用户名不存在'
            }
        }
    })

}
// 注册处理的中间件
exports.reg = async (ctx) => {
    let {username, password} = ctx.request.body
    console.log(ctx.request.body);
    
    await new Promise((res, rej) => {        
        User.find({username}, (err, data) => {
            // 查询报错了
            if(err) return rej(err)

            // 查询中没报错, 找到同名数据
            if(data.length != 0)return res("")

            // 查询没报错，可以注册
            const userobj = new User({
                username, 
                password: crypto(password)
            });

            userobj.save((err, data) => {
                if(err){
                    rej("保存失败")
                }else{
                    res("保存成功")
                }
            })
        })
    }).then(async data => {
        if(data){
            // 注册成功
            ctx.body = {
                status: true,
                msg: '注册成功'
            }
        }else{
            // 用户名已存在
            ctx.body = {
                status: false,
                msg: '用户名已存在'
            }
        }
    }, async err => {
        // 服务器错误
        ctx.body = {
            status: false,
            msg: '服务器开小差了'
        }
    })

}
// 是否为登录状态
exports.isNew = async(ctx) => {
    // 判断session是否存在
    if(ctx.session.isNew){
        // 从未登陆过
        if(ctx.cookies.get("userId")){
            // cookie有 session没有
            ctx.session = {
                username: ctx.cookies.get("username"),
                userId: ctx.cookies.get("userId"),
                avatar: ctx.cookies.get('avatar')
            };
        }
    }
    ctx.body = {
        session: ctx.session,
        isNew: ctx.session.isNew
    }
}
// 退出登录
exports.logout = async (ctx) => {
    ctx.session = null
    ctx.cookies.set("username", null, {
        maxAge: 0,
    })
    ctx.cookies.set("userId", null, {
        maxAge: 0,
    })
    ctx.body = {
        status: true,
        msg: '退出成功',
    }
}
// // 确定用户状态的中间件
// exports.keepLogin = async(ctx, next) => {
//     // 判断session是否存在
//     if(ctx.session.isNew){
//         // 从未登陆过
//         if(ctx.cookies.get("userId")){
//             // cookie有 session没有
//             ctx.session = {
//                 username: ctx.cookies.get("username"),
//                 userId: ctx.cookies.get("userId"),
//                 avatar: ctx.cookies.get('avatar')
//             };
//         }
//     }
//     await next()
// }


// // 修改用户头像
// exports.unload = async (ctx) => {
//     const filename =  ctx.req.file.filename;    
//     User.update(
//         {_id: ctx.session.userId},
//         {$set: {avatar: '/avatar/' + filename}}
//     )
//     ctx.render('isOk', {
//         status: 'logSuccess',
//         url: '/'
//     })
//     // ).then(data => {
//     //     // ctx.body = {
//     //     //     "code": 1,
//     //     //     "msg": ""
//     //     // }
//     //     ctx.render('isOk', {
//     //         status: 'logSuccess',
//     //         url: '/'
//     //     })
//     //     // ctx.session.avatar = '/avatar/' + filename;
//     //     // console.log(ctx.session.avatar);
        
//     // }, err => {
//     //     // ctx.body = {
//     //     //     "code": 0,
//     //     //     "msg": ""
//     //     // }
//     // })
    
// }