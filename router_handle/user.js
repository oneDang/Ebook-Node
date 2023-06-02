//  导入包
// 导入数据库的包 
const db = require('../db/index')
// 导入加密的工具包
const bcrypt = require('bcryptjs')
// token加密
const jwt = require('jsonwebtoken')
const config = require('../config')


// 用户注册路由
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 判断数据是否合法
    // if (!userinfo.username || !userinfo.password) {
    //     return res.send({ status: 1, message: '用户名或密码不能为空！' })
    // }
    // 定义sql语句
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行SQL语句失败
        if (err) {
            // return res.send({status:1,message:err.message})
            return res.cc(err)
        }
        // 判断用户名是否被占用
        if (results.length > 0) {
            // return res.send({status:1,message:'用户名被占用，请更换其他用户名！'})
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 判断之后开始对用户密码进行加密,  返回的是加密之后的字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        //  开始插入新用户的SQL语句
        const sql_insert = 'insert into ev_users set ?'
        // 插入的数据
        const insert_data = { username: userinfo.username, password: userinfo.password }
        db.query(sql_insert, insert_data, (err, results) => {
            if (err) {
                // return res.send({status:1,message:err.message})
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                // return res.send({status:1,message:'注册用户失败，请稍后再试！'})
                return res.cc('注册用户失败，请稍后再试！')

            }
            // 注册成功
            res.send({
                status: 0,
                message: '注册成功'
            })
        })
    })

}
// 用户登录路由
exports.login = (req, res) => {
    // 接收表单数据
    console.log(req.body);
    const userinfo = req.body
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 执行SQL语句失败时
        if (err) {
            // return res.send({status:1,message:err.message})
            return res.cc(err)
        }
        if (results.length !== 1) {
            return res.cc('登录失败!')
        }

        // 拿着用户输入的密码,和数据库中存储的密码进行对比
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误
        if (!compareResult) {
            return res.cc('登录失败！')
        }

        // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
        const user = { ...results[0], password: '', user_pic: '' }
        console.log('user', user);
        // 生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn  // token 有效期为 10 个小时
        })

        // 服务器返回给客户端的数据
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        })
    })


}

