var express = require('express')
var router = express.Router()
var connection = require('../db/sql.js')
var User = require('../db/userSql.js')
//引入腾讯云短信SDK
var QcloudSms = require('qcloudsms_js')
//引入token
let jwt = require('jsonwebtoken')
var qs = require('qs')
//引入支付宝配置文件
const alipaySdk = require('../db/alipay.js')
const AlipayFormData = require('alipay-sdk/lib/form').default

//引入axios
const axios = require('axios')

//验证token是否过期
function getTimeToken(exp) {
  //获取当前时间秒
  let getCurrentTime = Number.parseInt(new Date().getTime() / 1000)
  if (getCurrentTime - exp > 600) {
    return true
  }
  return false
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' })
})

//topBar数据
router.get('/api/index_list/0/topBar', function (req, res, next) {
  res.send({
    code: '200',
    data: [
      { id: 0, label: '推荐' },
      { id: 1, label: '大红袍' },
      { id: 2, label: '铁观音' },
      { id: 3, label: '绿茶' },
      { id: 4, label: '普洱' },
      { id: 5, label: '茶具' },
      { id: 6, label: '花茶' },
    ],
  })
})

//首页推荐的数据
router.get('/api/index_list/0/data/1', function (req, res, next) {
  res.send({
    code: '200',
    data: [
      //swiper
      {
        id: 0,
        type: 'swiperList',
        data: [
          { id: 0, imgUrl: './images/swiper1.jpeg' },
          { id: 1, imgUrl: './images/swiper2.jpeg' },
          { id: 2, imgUrl: './images/swiper3.jpeg' },
        ],
      },

      //icons
      {
        id: 1,
        type: 'iconsList',
        data: [
          { id: 1, title: '自饮茶', imgUrl: './images/icons1.png' },
          { id: 1, title: '茶具', imgUrl: './images/icons2.png' },
          { id: 1, title: '茶礼盒', imgUrl: './images/icons3.png' },
          { id: 1, title: '领福利', imgUrl: './images/icons4.png' },
          { id: 1, title: '官方验证', imgUrl: './images/icons5.png' },
        ],
      },

      //爆款推荐
      {
        id: 2,
        type: 'recommendList',
        data: [
          {
            id: 1,
            name: '龙井1号铁罐250g',
            content: '鲜爽甘醇 口粮首选',
            price: '68',
            imgUrl: './images/recommend.jpeg',
          },
          {
            id: 1,
            name: '龙井1号铁罐250g',
            content: '鲜爽甘醇 口粮首选',
            price: '68',
            imgUrl: './images/recommend.jpeg',
          },
          {
            id: 1,
            name: '龙井1号铁罐250g',
            content: '鲜爽甘醇 口粮首选',
            price: '68',
            imgUrl: './images/recommend.jpeg',
          },
        ],
      },
      //猜你喜欢
      {
        id: 3,
        type: 'likeList',
        data: [
          {
            id: 1,
            imgUrl: './images/goods1.png',
            name: '黄山太平猴魁绿茶1号',
            price: '99',
          },
          {
            id: 2,
            imgUrl: './images/goods2.png',
            name: '龙井TOP1浙江果栗香雨前龙井2号 ',
            price: '88',
          },
          {
            id: 3,
            imgUrl: './images/goods3.png',
            name: '浙江花果香碧螺春2号 ',
            price: '88',
          },
          {
            id: 4,
            imgUrl: './images/goods4.png',
            name: '安徽雨前黄山毛峰2号',
            price: '68',
          },
          {
            id: 5,
            imgUrl: './images/like.jpeg',
            name: '建盏茶具套装 红色芝麻豪 12件套',
            price: '299',
          },
          {
            id: 6,
            imgUrl: './images/like.jpeg',
            name: '建盏茶具套装 红色芝麻豪 12件套',
            price: '299',
          },
          {
            id: 7,
            imgUrl: './images/like.jpeg',
            name: '建盏茶具套装 红色芝麻豪 12件套',
            price: '299',
          },
          {
            id: 8,
            imgUrl: './images/like.jpeg',
            name: '建盏茶具套装 红色芝麻豪 12件套',
            price: '299',
          },
          {
            id: 9,
            imgUrl: './images/like.jpeg',
            name: '建盏茶具套装 红色芝麻豪 12件套',
            price: '299',
          },
          {
            id: 10,
            imgUrl: './images/like.jpeg',
            name: '建盏茶具套装 红色芝麻豪 12件套',
            price: '299',
          },
        ],
      },
    ],
  })
})

//首页大红袍的数据
router.get('/api/index_list/1/data/1', function (req, res, next) {
  res.send({
    data: [
      {
        id: 1,
        type: 'AdvertiMent',
        data: [
          { id: 0, imgUrl: '/images/dhp.jpeg' },
          { id: 1, imgUrl: '/images/dhp.jpeg' },
          { id: 2, imgUrl: '/images/dhp.jpeg' },
        ],
      },
    ],
  })
})

//首页铁观音的数据
router.get('/api/index_list/2/data/1', function (req, res, next) {
  res.send({
    data: [
      {
        id: 1,
        type: '铁观音',
        data: [
          { id: 0, imgUrl: '/images/tgy.jpeg' },
          { id: 1, imgUrl: '/images/tgy.jpeg' },
          { id: 2, imgUrl: '/images/tgy.jpeg' },
        ],
      },
    ],
  })
})

//查询商品数据的接口
router.get('/api/goods/shopList', function (req, res, next) {
  //前端传递到后端的查询关键字
  let [searchName, orderName] = Object.keys(req.query)
  //前端传递到后端的排序方式
  let [name, order] = Object.values(req.query)

  //调用数据库
  connection.query(
    `select * from goods_list where name like '%${name}%' order by ${orderName} ${order}`,
    function (error, results) {
      res.send({
        code: 0,
        data: results,
      })
    },
  )
})

//分类的接口
router.get('/api/goods/catelist', function (req, res, next) {
  res.send({
    code: 0,
    data: [
      //一级
      {
        id: 0,
        name: '推荐',
        data: [
          //二级
          {
            id: 0,
            name: '推荐',
            list: [
              //三级
              {
                id: 0,
                name: '紫砂壶',
                imgUrl: './images/1_1.jpeg',
              },
              {
                id: 1,
                name: '铁观音',
                imgUrl: './images/1_2.jpeg',
              },
              {
                id: 2,
                name: '金骏眉',
                imgUrl: './images/1_3.jpeg',
              },
              {
                id: 3,
                name: '武夷岩茶',
                imgUrl: './images/1_4.jpeg',
              },
              {
                id: 4,
                name: '龙井',
                imgUrl: './images/1_5.jpeg',
              },
              {
                id: 5,
                name: '云南滇红',
                imgUrl: './images/1_6.jpeg',
              },
              {
                id: 6,
                name: '建盏',
                imgUrl: './images/1_7.jpeg',
              },
              {
                id: 7,
                name: '功夫茶具',
                imgUrl: './images/1_8.jpeg',
              },
            ],
          },
        ],
      },

      {
        id: 1,
        name: '绿茶',
        data: [
          //二级
          {
            id: 0,
            name: '绿茶',
            list: [
              //三级
              {
                id: 0,
                name: '龙井',
                imgUrl: './images/2_1.jpeg',
              },
              {
                id: 1,
                name: '黄山毛峰',
                imgUrl: './images/2_2.jpeg',
              },
              {
                id: 2,
                name: '碧螺春',
                imgUrl: './images/2_3.jpeg',
              },
              {
                id: 3,
                name: '雀舌',
                imgUrl: './images/2_4.jpeg',
              },
              {
                id: 4,
                name: '太平猴魁',
                imgUrl: './images/2_5.jpeg',
              },
              {
                id: 5,
                name: '珍稀白茶',
                imgUrl: './images/2_6.jpeg',
              },
              {
                id: 6,
                name: '六安瓜片',
                imgUrl: './images/2_7.jpeg',
              },
            ],
          },
        ],
      },

      {
        id: 2,
        name: '乌龙',
        data: [
          //二级
          {
            id: 0,
            name: '乌龙',
            list: [
              //三级
              {
                id: 0,
                name: '永春佛手',
                imgUrl: './images/3_1.jpeg',
              },
              {
                id: 1,
                name: '铁观音',
                imgUrl: './images/3_2.jpeg',
              },
              {
                id: 2,
                name: '武夷岩茶',
                imgUrl: './images/3_3.jpeg',
              },
              {
                id: 3,
                name: '漳平水仙',
                imgUrl: './images/3_4.jpeg',
              },
            ],
          },
        ],
      },

      {
        id: 3,
        name: '红茶',
        data: [
          //二级
          {
            id: 0,
            name: '红茶',
            list: [
              //三级
              {
                id: 0,
                name: '英德红茶',
                imgUrl: './images/4_1.jpeg',
              },
              {
                id: 1,
                name: '坦洋工夫',
                imgUrl: './images/4_2.jpeg',
              },
              {
                id: 2,
                name: '金骏眉',
                imgUrl: './images/4_3.jpeg',
              },
              {
                id: 3,
                name: '正山小种',
                imgUrl: './images/4_4.jpeg',
              },
              {
                id: 4,
                name: '云南滇红',
                imgUrl: './images/4_5.jpeg',
              },
              {
                id: 5,
                name: '祁门红茶',
                imgUrl: './images/4_6.jpeg',
              },
            ],
          },
        ],
      },

      {
        id: 4,
        name: '白茶',
        data: [
          //二级
          {
            id: 0,
            name: '白茶',
            list: [
              //三级
              {
                id: 0,
                name: '白牡丹',
                imgUrl: './images/5_1.jpeg',
              },
              {
                id: 1,
                name: '牡丹王',
                imgUrl: './images/5_2.jpeg',
              },
              {
                id: 2,
                name: '白毫银针',
                imgUrl: './images/5_3.jpeg',
              },
              {
                id: 3,
                name: '寿眉',
                imgUrl: './images/5_4.jpeg',
              },
            ],
          },
        ],
      },

      {
        id: 5,
        name: '普洱',
        data: [
          //二级
          {
            id: 0,
            name: '普洱',
            list: [
              //三级
              {
                id: 0,
                name: '生茶',
                imgUrl: './images/6_1.jpeg',
              },
              {
                id: 1,
                name: '熟茶',
                imgUrl: './images/6_2.jpeg',
              },
            ],
          },
        ],
      },
      {
        id: 6,
        name: '茶具',
        data: [
          //二级
          {
            id: 0,
            name: '茶具',
            list: [
              //三级
              {
                id: 0,
                name: '茶宠',
                imgUrl: './images/7_1.jpeg',
              },
              {
                id: 1,
                name: '紫砂壶',
                imgUrl: './images/7_2.jpeg',
              },
              {
                id: 2,
                name: '建盏',
                imgUrl: './images/7_3.jpeg',
              },
              {
                id: 3,
                name: '功夫茶具',
                imgUrl: './images/7_4.jpeg',
              },
              {
                id: 4,
                name: '茶具配件',
                imgUrl: './images/7_5.jpeg',
              },
              {
                id: 5,
                name: '主人杯',
                imgUrl: './images/7_6.jpeg',
              },
              {
                id: 6,
                name: '干泡茶具',
                imgUrl: './images/7_7.jpeg',
              },
              {
                id: 7,
                name: '旅行茶具',
                imgUrl: './images/7_8.jpeg',
              },
              {
                id: 8,
                name: '整套茶具',
                imgUrl: './images/7_9.jpeg',
              },
              {
                id: 9,
                name: '茶盘',
                imgUrl: './images/7_10.jpeg',
              },
            ],
          },
        ],
      },
      {
        id: 7,
        name: '花茶',
        data: [
          //二级
          {
            id: 0,
            name: '花茶',
            list: [
              //三级
              {
                id: 0,
                name: '茉莉花茶',
                imgUrl: './images/8_1.jpeg',
              },
            ],
          },
        ],
      },
    ],
  })
})

//查询商品id的接口
router.get('/api/goods/id', function (req, res, next) {
  const id = req.query.id
  connection.query(`select * from goods_list where id=${id}`, function (error, results) {
    if (error) throw error
    res.send({
      code: 0,
      data: results[0],
    })
  })
})

//验证登录接口
router.post('/api/login', function (req, res, next) {
  //后端接收前端路由传过来的数据
  const params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd,
  }
  //查询用户手机号是存在
  connection.query(User.queryUserTel(params), function (error, results) {
    //手机号存在
    if (results.length > 0) {
      connection.query(User.queryUserPwd(params), function (error, result) {
        if (result.length > 0) {
          //手机号和密码匹配

          /**
            重新生成token
          */
          //引入token包
          let jwt = require('jsonwebtoken')
          //用户信息
          let payload = { tel: params.userTel }
          //口令
          let secret = 'xiaoluxian'
          //生成token,并设置token过期时间expiresIn
          let token = jwt.sign(payload, secret, {
            expiresIn: 600,
          })

          /**
            修改用户token值,重新得到该token过期时间
          */
          //解析token得到用户信息,此时的dtoken是对象,加密payload用的tel,解密后就包含用户的tel信息
          let dtoken = jwt.decode(token)
          //向数据库发送请求,通过tel获取用户id
          connection.query(
            `select * from user where tel = ${dtoken.tel}`,
            function (error, results) {
              if (error) throw error
              if (results.length > 0) {
                let uid = results[0].id
                connection.query(`update user set token = '${token}' where id = ${uid}`)
              }
            },
          )
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '登陆成功',
              data: result[0],
            },
          })
        } else {
          res.send({
            code: 302,
            data: {
              success: false,
              msg: '密码不正确',
            },
          })
        }
      })
    } else {
      //手机号不存在
      res.send({
        code: 301,
        data: {
          success: false,
          msg: '手机号不存在',
        },
      })
    }
  })
})

//请求验证码接口
router.post('/api/code', function (req, res, next) {
  //接收前端请求接口时发送的数据
  let userTel = req.body.userTel

  // 短信应用SDK AppID
  var appid = 1400187558 // SDK AppID是1400开头

  // 短信应用SDK AppKey
  var appkey = 'dc9dc3391896235ddc2325685047edc7'

  // 需要发送短信的手机号码
  var phoneNumbers = [userTel]

  // 短信模板ID，需要在短信应用中申请
  var templateId = 285590 // NOTE: 这里的模板ID`7839`只是一个示例，真实的模板ID需要在短信控制台中申请

  // 签名
  var smsSign = '三人行慕课' // NOTE: 这里的签名只是示例，请使用真实的已申请的签名, 签名参数使用的是`签名内容`，而不是`签名ID`

  // 实例化QcloudSms
  var qcloudsms = QcloudSms(appid, appkey)

  // 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
  function callback(err, response, resData) {
    if (err) {
      console.log('err: ', err)
    } else {
      //返回生成的验证码和用户输入的验证码进行校验
      res.send({
        code: 200,
        data: {
          success: true,
          data: response.req.body.params[0],
        },
      })
    }
  }

  var ssender = qcloudsms.SmsSingleSender()
  //自定义验证码
  var params = [Math.floor(Math.random() * (9999 - 1000) + 1000)]
  ssender.sendWithParam(86, phoneNumbers[0], templateId, params, smsSign, '', '', callback) // 签名参数不能为空串
})

//添加用户接口
router.post('/api/addUser', function (req, res, next) {
  //接口用户电话号码
  const params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd,
  }

  //查询数据库是否存在,不存在即添加，存在即不处理
  connection.query(User.queryUserTel(params), function (error, results) {
    if (error) throw error
    if (results.length > 0) {
      //存在,如果接收到密码数据为空,则表示用户希望通过验证码的方式登录
      if (params.userPwd) {
        res.send({
          code: 200,
          data: {
            success: true,
            msg: '手机号已存在,请前往登录',
            data: results[0],
          },
        })
        return
      }
      /**
        重新生成token
      */
      //引入token包
      let jwt = require('jsonwebtoken')
      //用户信息
      let payload = { tel: params.userTel }
      //口令
      let secret = 'xiaoluxian'
      //生成token,并设置token过期时间expiresIn
      let token = jwt.sign(payload, secret, {
        expiresIn: 600,
      })

      /**
        修改用户token值,重新得到该token过期时间
      */
      //解析token得到用户信息,此时的dtoken是对象,加密payload用的tel,解密后就包含用户的tel信息
      let dtoken = jwt.decode(token)
      //向数据库发送请求,通过tel获取用户id
      connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
        if (error) throw error
        if (results.length > 0) {
          let uid = results[0].id
          connection.query(`update user set token = '${token}' where id = ${uid}`)
        }
      })
      res.send({
        code: 200,
        data: {
          success: true,
          msg: '登录成功',
          data: results[0],
        },
      })
    } else {
      //不存在
      connection.query(User.insertUserData(params), function (error, results) {
        if (error) throw error
        /* 
          注册
          1.如果接收到密码不为空,则表示用户正在使用注册功能
          2.查询手机号是否已存在
          3.存在则提示手机号已注册,请前往登录;否则为用户注册信息
        */
        if (params.userPwd) {
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '注册成功,请前往登录',
            },
          })
          return
        }
        res.send({
          code: 200,
          data: {
            success: true,
            msg: '登录成功',
          },
        })
      })
    }
  })
})

//查询用户手机号是否存在接口
router.post('/api/selectUser', function (req, res, next) {
  const params = {
    userTel: req.body.userTel,
  }
  connection.query(User.queryUserTel(params), function (error, results) {
    if (error) throw error
    if (results.length > 0) {
      res.send({
        code: 200,
        data: {
          success: true,
        },
      })
    } else {
      res.send({
        code: 0,
        data: {
          success: false,
          msg: '该手机号不存在,请注册',
        },
      })
    }
  })
})

//修改用户密码接口
router.post('/api/updateUser', function (req, res, next) {
  const params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd,
  }
  connection.query(User.updateUser(params), function (error, results) {
    console.log(results)
    res.send({
      code: 200,
      data: {
        success: true,
        msg: '修改成功',
      },
    })
  })
})

//添加商品到购物车接口
router.post('/api/addCart', function (req, res, next) {
  //获取前端的商品id
  let goodsId = req.body.goodsId
  //token
  let token = req.headers.token
  //解析token得到用户信息,此时的dtoken是对象,加密payload用的tel,解密后就包含用户的tel信息
  let dtoken = jwt.decode(token)

  //判断token是否过期
  if (getTimeToken(dtoken.exp)) {
    res.send({
      data: {
        isTokenOut: true,
        msg: '登录超时,请重新登录',
      },
    })
    return
  }

  //向数据库发送请求,通过tel获取用户id
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    if (error) throw error
    if (results.length > 0) {
      let uid = results[0].id
      //向数据库发送请求,通过goodsId获取商品的所有信息
      connection.query(`select * from goods_list where id = ${goodsId}`, function (error, result) {
        if (error) throw error
        if (result.length > 0) {
          let goods_name = result[0].name
          let goods_price = result[0].price
          let goods_imgUrl = result[0].imgUrl
          let goods_content = result[0].content
          //到购物车数据库查是否有该商品,存在即使商品数量+1,不存在则添加
          connection.query(
            `select * from goods_cart where goods_id = ${goodsId} and uid = ${uid}`,
            function (error, res) {
              if (res.length > 0) {
                //使存在的商品+1
                let goods_num = Number.parseInt(res[0].goods_num) + 1
                connection.query(
                  `update goods_cart set goods_num = ${goods_num} where goods_id=${goodsId} and uid = ${uid}`,
                )
              } else {
                //向购物车数据库添加数据
                connection.query(
                  `insert into goods_cart (uid,goods_id,goods_name,goods_content,goods_price,goods_num,goods_imgUrl) values (${uid},${goodsId},'${goods_name}','${goods_content}','${goods_price}','1','${goods_imgUrl}')`,
                )
              }
            },
          )
          res.send({
            code: 200,
            data: {
              success: true,
              msg: '添加成功',
            },
          })
        }
      })
    }
  })
})

//查询购物车数据接口
router.post('/api/selectCart', function (req, res, next) {
  const token = req.headers.token
  const dtoken = jwt.decode(token)

  //查询用户
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id

    //判断token是否过期
    if (getTimeToken(dtoken.exp)) {
      res.send({
        data: {
          isTokenOut: true,
          msg: '登录超时,请重新登录',
        },
      })
      return
    }

    //查询购物车
    connection.query(`select * from goods_cart where uId = ${uId}`, function (error, result) {
      res.send({
        code: 200,
        data: {
          success: true,
          data: result,
        },
      })
    })
  })
})

//删除购物车数据接口
router.delete('/api/delete/id', function (req, res, next) {
  const idArr = req.body.id
  //对多个商品进行拼接以适配sql语句的多行数据删除
  let str = ''
  idArr.forEach((v) => {
    str += v + ','
  })
  //去掉字符串中最后的逗号
  str = str.slice(0, str.length - 1)
  connection.query(`delete from goods_cart where id in (${str})`)
  res.send({
    code: 200,
    data: {
      success: true,
    },
  })
})

//修改商品数量
router.post('/api/updateNum', function (req, res, next) {
  const data = {
    id: req.body.id,
    num: req.body.num,
  }
  connection.query(
    `update goods_cart set goods_num = ${data.num} where id=${data.id}`,
    function (error, results) {
      if (error) throw error
      res.send({
        data: {
          success: true,
        },
      })
    },
  )
})

//新增地址
router.post('/api/addAddress', function (req, res, next) {
  const addressInfo = req.body.content
  const token = req.headers.token
  const dtoken = jwt.decode(token)
  //查询用户
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id
    //添加之前判断是否有勾选'默认地址',有则将当前新增地址更改为默认,将之前的默认地址改变状态
    if (addressInfo.isDefault) {
      connection.query(`update address set isDefault = 0 where uid = ${uId}`)
    }
    //添加地址
    connection.query(
      `insert into address (uid,name,tel,province,city,county,addressDetail,areaCode,isDefault) values (${uId},'${addressInfo.name}','${addressInfo.tel}','${addressInfo.province}','${addressInfo.city}','${addressInfo.county}','${addressInfo.addressDetail}','${addressInfo.areaCode}','${addressInfo.isDefault}')`,
    )
    res.send({
      data: {
        code: 200,
        success: true,
        msg: '地址添加成功',
      },
    })
  })
})

//查询地址
router.post('/api/selectAddress', function (req, res, next) {
  const token = req.headers.token
  const dtoken = jwt.decode(token)
  //查询用户
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    //用户id
    let uId = results[0].id
    //判断token是否过期
    if (getTimeToken(dtoken.exp)) {
      res.send({
        data: {
          isTokenOut: true,
          msg: '登录超时,请重新登录',
        },
      })
      return
    }
    //查询地址
    connection.query(`select * from address where uid = ${uId}`, function (error, result) {
      res.send({
        data: {
          code: 200,
          success: true,
          msg: '地址查询成功',
          data: result,
        },
      })
    })
  })
})

//修改地址
router.post('/api/editAddress', function (req, res, next) {
  const token = req.headers.token
  const dtoken = jwt.decode(token)
  const addressInfo = req.body.content

  //查询用户
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    //用户uId
    let uId = results[0].id
    //添加之前判断是否有勾选'默认地址',有则将当前新增地址更改为默认,将之前的默认地址改变状态
    if (addressInfo.isDefault) {
      connection.query(`update address set isDefault = 0 where uid = ${uId}`)
    }
    //修改地址
    connection.query(
      `update address set name='${addressInfo.name}',tel='${addressInfo.tel}',province='${addressInfo.province}',city='${addressInfo.city}',county='${addressInfo.county}',addressDetail='${addressInfo.addressDetail}',areaCode='${addressInfo.areaCode}',isDefault='${addressInfo.isDefault}' where id = ${addressInfo.id} and uid = ${uId}`,
      function (error, result) {
        res.send({
          data: {
            code: 200,
            success: true,
            msg: '地址修改成功',
          },
        })
      },
    )
  })
})

//删除地址
router.post('/api/delAddress', function (req, res, next) {
  const token = req.headers.token
  const dtoken = jwt.decode(token)
  const aid = req.body.id
  //查询用户
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    //用户uId
    let uId = results[0].id
    //删除地址
    connection.query(`delete from address where id = ${aid} and uid = ${uId}`)
    res.send({
      data: {
        code: 200,
        success: true,
        msg: '删除成功',
      },
    })
  })
})

//提交订单
router.post('/api/addOrder', function (req, res, next) {
  const token = req.headers.token
  const dtoken = jwt.decode(token)
  //解析传过来的经过qs序列化传递的数据
  const orderData = qs.parse(req.body)

  //生成订单号order_id(规则：时间戳+6位随机数)
  const order_id = Date.now() + Math.floor(Math.random() * 1000000).toString()
  //数据库需要在一个字段中存储多个商品的id,因此需要将多个商品id遍历组合成字符串存储,需要的时候就split解析
  const goods = orderData.goods
  let goodsId = ''
  for (let i = 0; i < goods.length; i++) {
    goodsId += goods[i].goods_id
    if (i + 1 < goods.length) {
      goodsId += ','
    }
  }
  //数据库需要在一个字段中存储多个商品对应的数量,因此需要将多个商品id遍历组合成字符串存储,需要的时候就split解析
  let goodsNum = ''
  for (let i = 0; i < goods.length; i++) {
    goodsNum += goods[i].goods_num
    if (i + 1 < goods.length) {
      goodsNum += ','
    }
  }

  const data = {
    goodsId: goodsId,
    goodsNum: goodsNum,
    address: orderData.path,
    payment: orderData.payment,
    totalprice: orderData.totalprice,
    totalnum: orderData.totalnum,
    order_id: order_id,
  }
  //查询用户
  connection.query(`select * from user where tel = ${dtoken.tel}`, function (error, results) {
    //用户uId
    let uId = results[0].id

    //判断token是否过期
    if (getTimeToken(dtoken.exp)) {
      res.send({
        data: {
          isTokenOut: true,
          msg: '登录超时,请重新登录',
        },
      })
      return
    }

    //插入订单数据
    //order_status,0已取消 1未支付 2支付成功
    connection.query(
      `insert into orders (uid,order_id,goods_id,goods_num,totalnum,totalprice,payment,order_status) values ('${uId}','${data.order_id}','${data.goodsId}','${data.goodsNum}','${data.totalnum}','${data.totalprice}','${data.payment}','1')`,
    )
    //删除购物车数据
    connection.query(`delete from goods_cart where uId=${uId} and goods_id in (${data.goodsId})`)
    //对接支付宝返回url
    //选择支付宝付款
    if (data.payment == 'aliPay') {
      //对接支付宝API
      const formData = new AlipayFormData()
      //调用setMethod并传入get,返回可以跳转到支付页面的url
      formData.setMethod('get')
      //支付时显示的页面信息
      formData.addField('bizContent', {
        outTradeNo: data.order_id, //订单号
        productCode: 'FAST_INSTANT_TRADE_PAY', //写死的数据
        totalAmount: data.totalprice, //总价
        subject: '商品', //商品名称
      })
      //支付成功or失败跳转的链接
      formData.addField('returnUrl', 'http://localhost:8080/Payment') //临时使用的本地地址,上线后需要变更
      //返回Promise
      const result = alipaySdk.exec('alipay.trade.page.pay', {}, { formData: formData })
      result.then((resp) => {
        res.send({
          data: {
            code: 200,
            success: true,
            msg: '支付中',
            paymentUrl: resp,
          },
        })
      })
    }
  })
})

//通过返回的数据请求支付宝判断支付成功与否
router.post('/api/PaymentStatus', function (req, res, next) {
  //token
  const token = req.headers.token
  const dtoken = jwt.decode(token)

  //订单号
  const out_trade_no = req.body.out_trade_no
  const trade_no = req.body.trade_no

  //支付宝配置
  const formData = new AlipayFormData()
  //调用setMethod并传入get,返回可以跳转到支付页面的url
  formData.setMethod('get')
  //支付时显示的页面信息
  formData.addField('bizContent', {
    out_trade_no,
    trade_no,
  })
  const result = alipaySdk.exec('alipay.trade.query', {}, { formData: formData })
  result.then((resp) => {
    //根据返回的数据请求支付宝
    axios({
      url: resp,
      method: 'GET',
    })
      .then((result) => {
        const responseCode = result.data.alipay_trade_query_response
        if (responseCode.code === '10000') {
          //发送请求,修改数据库订单状态为'已付款'
          connection.query(
            `update orders set order_status = 2 where order_id = ${result.data.alipay_trade_query_response.out_trade_no}`,
          )
          res.send({
            data: {
              code: 200,
              success: true,
              msg: '交易成功',
            },
          })
        } else if (responseCode.code === '10003') {
          switch (responseCode.trade_status) {
            case 'WAIT_BUYER_PAY':
              //发送请求,修改数据库订单状态为'等待支付'

              res.send({
                data: {
                  code: 202,
                  msg: '支付宝有交易记录,但未付款',
                },
              })
              break
            case 'TRADE_FINISHIED':
              //发送请求,修改数据库订单状态为'已付款'
              res.send({
                data: {
                  code: 201,
                  msg: '交易结束,不可退款',
                },
              })
              break
            case 'TRADE_SUCCESS':
              //发送请求,修改数据库订单状态为'已付款'
              res.send({
                data: {
                  code: 201,
                  msg: '交易完成,即将到账',
                },
              })
              break
            case 'TRADE_CLOSED':
              //发送请求,修改数据库订单状态为'交易关闭'
              connection.query(
                `update orders set order_status = 0 where order_id = ${result.data.alipay_trade_query_response.out_trade_no}`,
              )
              res.send({
                data: {
                  code: 203,
                  msg: '交易关闭',
                },
              })
              break
          }
        } else if (responseCode.code === '40004') {
          //发送请求,修改数据库订单状态为'交易关闭'
          connection.query(
            `update orders set order_status = 0 where order_id = ${result.data.alipay_trade_query_response.out_trade_no}`,
          )
          res.send({
            data: {
              code: 404,
              succcess: false,
              msg: '交易失败',
            },
          })
        }
      })
      .catch((err) => {
        //发送请求,修改数据库订单状态为'交易关闭'
        connection.query(
          `update orders set order_status = 0 where order_id = ${result.data.alipay_trade_query_response.out_trade_no}`,
        )
        res.send({
          data: {
            code: 500,
            msg: '交易失败',
          },
        })
      })
  })
})

module.exports = router
