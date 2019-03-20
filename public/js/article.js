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
  //   // const $ = layui.$
  //   const layedit = layui.layedit;
  //   const layer = layui.layer
  
  
  //   const idx = layedit.build('comment-txt', {
  //     tool: [],
  //     height: 160
  //   }); //建立编辑器
  
  //   
  
    
  
  //   $(".comment button").click(async () => {
  //     let content = layedit.getContent(idx).trim()
  
  //     if(content.length === 0)return layer.msg("评论内容不能为空")
  
  //     const data = {
  //       content,
  //       article: $(".art-title").data("artid")
  //     }
  
  //     $.post("/comment", data, (data) => {
  //       layer.msg(data.msg, {
  //         time: 1000,
  //         end(){
  //           if(data.status === 1){
  //             window.location.reload()
  //           }
  //         }
  //       })
  //     })
  //   })
  // });
  layui.use(['form', 'layedit', "element"], function() {
    let val = "#{logNot}";
    const form = layui.form;
    const layedit = layui.layedit;
    const $ = layui.$
    $.get("/user/isNew", (data) => {
      console.log(data.isNew)
      if(data.isNew){
        layer.msg('请先登录', {
          end(){
            location.href('/user/login')
          }
        })
      }
    })
    const index = layedit.build('article-content', {
      hideTool: [
        'image' //插入图片
      ]
    }); //建立编辑器
    form.on("submit(send)", (res) => {
      const { tips, title } = res.field

      if(layedit.getText(index).trim().length === 0)return layer.alert("请输入内容")
      
      const data = {
        tips,
        title,
        content: layedit.getContent(index)
      }

      $.post("/article", data, (msg) => {
        if(msg.status){
          layer.alert('发表成功', (res) => {
            location.href = "/"
          })
        }else{
          layer.alert(`发表失败，失败信息：${msg.msg}`)
        }
      })
    })
  });
}

