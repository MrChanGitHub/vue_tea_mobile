const User = {
  //查询用户手机号
  queryUserTel(option) {
    return `select * from user where tel = ${option.userTel}`
  },

  //查询用户手机号与密码是否匹配
  queryUserPwd(option) {
    return `select * from user where tel = ${option.userTel} and pwd = ${option.userPwd}`
  },

  //新增用户
  insertUserData(option) {
    //引入token包
    let jwt = require('jsonwebtoken')
    //用户信息
    let payload = { tel: option.userTel }
    //口令
    let secret = 'xiaoluxian'
    //生成token,并设置token过期时间expiresIn
    let token = jwt.sign(payload, secret, {
      expiresIn: 600,
    })
    if (option.userPwd) {
      return `insert into user (tel,pwd,imgUrl,nickName,token) values (${option.userTel},${option.userPwd},'/images/list1.jpeg',${option.userTel},'${token}')`
    }
    return `insert into user (tel,imgUrl,nickName,token) values (${option.userTel},'/images/list1.jpeg',${option.userTel},'${token}')`
  },

  //修改用户密码
  updateUser(option) {
    return `update user set pwd = ${option.userPwd} where tel = ${option.userTel}`
  },
}

module.exports = User
