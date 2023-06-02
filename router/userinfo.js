const expressJoi = require('@escook/express-joi')
const express = require('express')
const router = express.Router()
const router_handle = require('../router_handle/userinfo')
const {update_userInfo_schema} = require('../schema/user')
const {update_passWord_schema} = require('../schema/user')
const {update_avatar_schema} = require('../schema/user')
// 挂载路由 获取用户信息的处理函数
router.get('/userinfo',router_handle.getUserInfo)
// 更新用户信息 添加验证规则对象
router.post('/userinfo',expressJoi(update_userInfo_schema),router_handle.UpdateUserInfo)
// 更新密码信息
router.post('/updatepwd',expressJoi(update_passWord_schema), router_handle.updatePassword)
// 更新用户头像
router.post('/update/avatar',expressJoi(update_avatar_schema), router_handle.updateAvatar)

module.exports= router