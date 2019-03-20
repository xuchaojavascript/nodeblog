window.onload = () => {
    // 请求的封装
    let getData = (url, method, data) => {
        return new Promise((res, rej) => {
            $.ajax({
                type: method || 'GET',
                url,
                dataType: 'json',
                data,
                success: data => res(data)
            });
        })
    }
    // 登陆注册页面跳转
    getData("/user/islogin")
        .then(data => {
            if(data){
                $('.user-logreg').eq(0).addClass('layui-this')
                $('.user-logreg').eq(1).removeClass('layui-this')
                $('.user-logreg-con').eq(0).addClass('layui-show')
                $('.user-logreg-con').eq(1).removeClass('layui-show')
            }else{
                $('.user-logreg').eq(1).addClass('layui-this')
                $('.user-logreg').eq(0).removeClass('layui-this')
                $('.user-logreg-con').eq(1).addClass('layui-show')
                $('.user-logreg-con').eq(0).removeClass('layui-show')
            }
        });
    // 点击tab选项卡
    $('.user-logreg').on('click', function(e){
        if($(this).hasClass('layui-this')){
            e.preventDefault();
        }
    })
    // 登陆注册请求
    layui.use(['layedit', 'layer', 'element'], function(){
        // 登陆请求
        $(".login-submit").click(() => {
            let loginName = $.trim($('.login-username').val())
            let loginPwd = $.trim($('.login-pwd').val())
            if(!loginName){
                layer.msg("用户名不能为空")
                return
            }
            if(!loginPwd){
                layer.msg("密码不能为空")
                return
            }
            const loginInfo = {
                username : loginName,
                password : loginPwd
            }
            $.post("/user/login", loginInfo, (data) => {
                layer.msg(data.msg, {
                    time: 1000,
                    end(){
                    if(data.status){
                        location.href = '/'                
                    }else{
                        $('.login-pwd').val('')
                    }
                    }
                })
            })
        })
        // 注册请求
        $(".reg-submit").click(() => {
            let regName = $.trim($('.reg-username').val())
            let regPwd = $.trim($('.reg-pwd').val())
            let regCfmPwd = $.trim($('.reg-cfmpwd').val())
            if(!regName){
                layer.msg("用户名不能为空")
                return
            }
            if(!regPwd){
                layer.msg("密码不能为空")
                return
            }
            if(regPwd !== regCfmPwd){
                layer.msg("密码不一致")
                return
            }
            const regInfo = {
                username : regName,
                password : regPwd
            }
            
            $.post("/user/reg", regInfo, (data) => {
                layer.msg(data.msg, {
                    time: 1000,
                    end(){
                        if(data.status){
                            location.href = '/user/login'
                        }else{
                            $('.reg-pwd').val('')
                            $('.reg-cfmpwd').val('')
                        }
                    }
                })
            })
        })
    })
}

  