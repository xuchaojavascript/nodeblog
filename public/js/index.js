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
  // 获取文章列表
  getData("/article/getlist")
      .then(data => {
          if(!data.artList.length){
            $('.article-list').html(`
            <li>
              <p style="text-align:center;">无数据</p>
            </li>
            `)
          }else{  
            str = ``
            data.artList.forEach(v => {
              str += `
                <li>
                  <a href="javascript:;" class="list-face">
                    <img src="${v.author.avatar}" alt="${v.author}">
                  </a>
                  <h2>
                    <a href="javascript:;" class="layui-badge">${v.tips}</a>
                    <a href="/article/detail/${v._id}" class="articlt-title ellipsis">
                      ${v.title}
                    </a>
                  </h2>
                  <div class="list-info">
                    <a href="javascript:;">${v.author.username}</a>
                    <span>${new Date(v.createTime).toLocaleString()}</span>
                    <span class="list-reply">
                      <i title="评论" class="layui-icon layui-icon-dialogue">
                        ${v.commentNum}
                      </i>
                    </span>
                  </div>
                </li>
              `
            });
            $('.article-list').html(str)
          }
      });

}

/* 分页 */
layui.use(["element", "laypage"], () => {
  let element = layui.element
  let laypage = layui.laypage
  const $ = layui.$
  
  element.tabDelete('demo', 'xxx')


  laypage.render({
    elem: "laypage",
    count: $("#laypage").data("maxnum"),
    limit: 5,
    groups: 3,
    curr: location.pathname.replace("/page/", ""),
    jump(obj, f){
      $("#laypage a").each((i, v) => {
        let pageValue = `/page/${$(v).data("page")}`
        v.href = pageValue
      })
    },
    theme : "#1E9FFF"
  })
})
