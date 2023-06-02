// 导入数据库的包 
const db = require('../db/index')
const bcryptjs = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // 根据用户的 id，查询用户的基本信息

    // 查询信息
    // 注意：为了防止用户的密码泄露，需要排除 password 字段
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`
    // 注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        // 1. 执行 SQL 语句失败
        if (err) return res.cc(err)

        // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('获取用户信息失败！')

        // 3. 将用户信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })
}

// 更新用户的基本信息
exports.UpdateUserInfo = (req, res) => {
    // 定义SQL语句
    const updateSql = `update ev_users set ? where id=?`
    // 调用数据库
    console.info('req',req);
    db.query(updateSql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        // 执行 SQL 语句成功，但影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('修改用户基本信息失败！')
        // 修改用户信息成功
        return res.cc('修改用户基本信息成功', 0)
    })
}

//更新密码信息
exports.updatePassword = (req, res) => {
    //1. 先判断用户是否存在
    const updatePwdSql = `select * from ev_users where id=?`
    db.query(updatePwdSql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('用户不存在！')

        // 在头部区域导入 bcryptjs 后，
        // 即可使用 bcrypt.compareSync(提交的密码，数据库中的密码) 方法验证密码是否正确
        // compareSync() 函数的返回值为布尔值，true 表示密码正确，false 表示密码错误
        //    2.判断用户提交的旧密码是否正确
        const compareResult = bcryptjs.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('旧密码错误！')

        
        // 3. 对新密码进行 `bcrypt` 加密之后，更新到数据库中
        const sql = `update ev_users set password=? where id=?`
        // 对新密码进行加密处理
        const newPwd = bcryptjs.hashSync(req.body.newPwd, 10)
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) return res.cc('更新密码失败！')
            res.cc('更新密码成功！', 0)
        })
    })



}

// 更新用户头像信息
exports.updateAvatar = (req,res)=>{
    const sql = 'update ev_users set user_pic=? where id=?'
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
      
        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (results.affectedRows !== 1) return res.cc('更新头像失败！')
      
        // 更新用户头像成功
        return res.cc('更新头像成功！', 0)
      })
    // res.send('ok')
}