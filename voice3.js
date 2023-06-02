/* Created by iflytek on 2020/03/01.
 *
 * 运行前：请先填写 appid、apiSecret、apiKey
 * 
 * 在线语音合成调用demo
 * 此demo只是一个简单的调用示例，不适合用到实际生产环境中
 *
 * 在线语音合成 WebAPI 接口调用示例 接口文档（必看）：https://www.xfyun.cn/doc/tts/online_tts/API.html
 * 错误码链接：
 * https://www.xfyun.cn/document/error-code （code返回错误码时必看）
 * 
 */
const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
var log = require('log4node')
var fs = require('fs')


function createVoice (req, res) {
    // 系统配置 
    const config = {
        // 请求地址
        hostUrl: "wss://tts-api.xfyun.cn/v2/tts",
        host: "tts-api.xfyun.cn",
        //在控制台-我的应用-在线语音合成（流式版）获取
        appid: "1b961c70",
        //在控制台-我的应用-在线语音合成（流式版）获取
        apiSecret: "YTFjZjNiNTQ0ZmY5YzZiNGYyZTBkMmY5",
        //在控制台-我的应用-在线语音合成（流式版）获取
        apiKey: "fd2d297fa22431eb4c3ad0edc7eca66c",
        text: req.query.text,
        uri: "/v2/tts",
    }
    // 获取当前时间 RFC1123格式
    let date = (new Date().toUTCString())
    // 设置当前临时状态为初始化

    let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
    let ws = new WebSocket(wssUrl)

    // 连接建立完毕，读取数据进行识别
    ws.on('open', () => {
        log.info("websocket connect!")
        send()
        // 如果之前保存过音频文件，删除之
        if (fs.existsSync('./test.pcm')) {
            fs.unlink('./test.pcm', (err) => {
                if (err) {
                    log.error('remove error: ' + err)
                }
            })
        }
    })

    // 得到结果后进行处理，仅供参考，具体业务具体对待
    ws.on('message', (data, err) => {
        log.info("websocket message!")
        if (err) {
            log.error('message error: ' + err)
            return
        }
        let ress = JSON.parse(data)

        if (ress.code != 0) {
            log.error(`${ress.code}: ${ress.message}`)
            ws.close()
            return
        }
        let audio = ress.data.audio
        let audioBuf = Buffer.from(audio, 'base64')
        // ress.setEncoding('binary')
        save(audioBuf)

        if (ress.code == 0 && ress.data.status == 2) {
            ws.close()
        }
    })

    // 资源释放
    ws.on('close', () => {
        log.info('connect close!')
    })

    // 连接错误
    ws.on('error', (err) => {
        log.error("websocket connect err: " + err)
    })

    // 鉴权签名
    function getAuthStr (date) {
        let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
        let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
        let signature = CryptoJS.enc.Base64.stringify(signatureSha)
        let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
        let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
        return authStr
    }

    // 传输数据
    function send () {
        let frame = {
            // 填充common
            "common": {
                "app_id": config.appid
            },
            // 填充business
            "business": {
                "aue": "lame",
                "auf": "audio/L16;rate=16000",
                "vcn": "xiaoyan",
                "tte": "UTF8"
            },
            // 填充data
            "data": {
                "text": Buffer.from(config.text).toString('base64'),
                "status": 2
            }
        }
        ws.send(JSON.stringify(frame))
    }

    // 保存文件
    function save (data) {
        console.log(data);
        const fileName = new Date().getTime()
        const filePath = `${mp3FilePath}/${fileName}.mp3`
        const downloadUrl = `${resUrl}/MP3/${fileName}.mp3`
        fs.writeFile(filePath, data, 'binary', err => {
            if (err) {
                res.json({
                    error: 1,
                    msg: '下载失败'
                })
            } else {

                res.json({
                    error: 0,
                    msg: '下载成功',
                    path: downloadUrl
                })
            }
        })

    }
}
module.exports = createVoice
