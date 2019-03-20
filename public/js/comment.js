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
    // 判断是否登录
    getData("/user/isNew")
    .then(data => {
        if(data.isNew){
        $('.user-alylog').css('display', 'none')
        $('.user-notlog').css('display', 'block')
        }else{
        $('.user-alylog').css('display', 'block')
        $('.user-notlog').css('display', 'none')
        $('.user-alylog .user-avatar').attr('src', data.session.avatar)
        $('.user-alylog .user-name').val(data.session.username)
        }
    });
    // 获取文章详细信息数据
    getData("/article/getartinfo")
    .then(data => {   
        console.log(data);
    
        $('.article-author').html(data.article.author.username);
        $('.article-title').html(data.title);
        $('.article-title').attr("data-artid", data.article._id);
        $('.article-time').html(new Date(data.article.createTime).toLocaleString());
        $('.article-tip').html(data.article.tips);
        $('.article-content').html(data.article.content);
        $('#loading').css('display', 'none')
        if(data.comment.length){
            let commentList = ``
            data.comment.forEach(v => {
                commentList += `
                    <li>
                        <img src="${v.author.avatar}" alt="">
                        <div>
                            <p class="author">${v.author.username}</p>
                            <p class="time">${new Date(data.createTime).toLocaleString()}</p>
                        </div>
                        <div class="she-said">${v.content}</div>
                    </li>
                `
            });
            $('.comment-list').html(commentList);
        }
    });
    //  发表评论
    layui.use(['form', 'layedit', "element"], function() {
        let val = "#{logNot}";
        const form = layui.form;
        const layedit = layui.layedit;
        const $ = layui.$
        const idx = layedit.build('comment-txt', {
            tool: [],
            height: 160
        }); //建立编辑器
        $(".layui-unselect.layui-layedit-tool").hide();
        $(".comment button").click(async () => {
            console.log(11);
            
            let content = layedit.getContent(idx).trim()
        
            if(content.length === 0)return layer.msg("评论内容不能为空")

            const data = {
                content,
                article: $(".art-title").data("artid")
            }
            
            $.post("/comment", data, (data) => {
                layer.msg(data.msg, {
                    time: 1000,
                    end(){
                        if(data.status === 1){
                            window.location.reload()
                        }
                    }
                })
            })
        })
    });

}
 