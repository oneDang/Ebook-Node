const experssion = require('express')
const axios = require('axios')
const app = experssion()

app.get('/', (req, res) => {
  // axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
  //   prompt: "Hello, how are you?",
  //   max_tokens: 60,
  //   n: 1,
  //   stop: "\n"
  // }, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer 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`
  //   }
  // }).then(response => {
  //   // 将响应发送给客户端
  //   res.send(response.data.choices[0].text)
  // }).catch(error => {
  //   // 处理错误情况并向客户端发送错误信息
  //   res.status(500).send(`An error occurred: ${error.message}`)
  // })
  app.post("/chart", async (req, res) => {
    // console.log('=================== req', req.body)
    var data = JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": "Hello, how are you?" //messages就是你发的消息是数组形式
    });
    var config = {
      method: 'post',
      url: 'https://api.openai-proxy.com/v1/chat/completions',
      headers: {
        'Authorization': 'Bearer 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',
        'Content-Type': 'application/json',
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        res.send({ code: 200, msg: response.data })
      })
      .catch(function (error) {
        console.log(error);
      });
  })

})

app.listen(3003, () => {
  console.log('server is listening at http://localhost:3003')
})
