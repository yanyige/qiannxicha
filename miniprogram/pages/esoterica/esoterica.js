const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    users: null,
    avoid: '',
    suit: '',
    zodiac: '龙',
    constellation: '处女座',
    secret: '',
    isGoodLuck: true,
    shared: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    wx.showLoading();
    const json = require('../../static/secret.js');
    console.log('options', options);
    const shared = options.shared
    this.setData({
      shared,
      openid: app.globalData.openid
    })
    // 分享状态
    if (shared == "true") {
      app.globalData.openid = options.openid;
      const user_esoterica = JSON.parse(options.user_esoterica);
      console.log('user_esoterica', user_esoterica);
      this.setData({
        ...user_esoterica,
        shared,
        openid: app.globalData.openid
      }, () => {
        console.log('this.data', this.data);
        wx.hideLoading();
      });
      return ;
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log('userInfo', res);
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    });

    if (app.globalData.guest) {
      this.setData({
        userInfo: {
          avatarUrl: 'http://qx.tkmao.com/wenchuang/esoterica/user.jpeg'
        }
      })
    }

    const db = wx.cloud.database()
    // 判断是否有该记录
    const res = await db.collection('users').where({
      _openid: app.globalData.openid
    }).get();
    if (res.data.length) {
      const data = res.data[0];
      this.setData({
        users: data
      });
      const date = new Date(data['date']);
      let suit = ['诸事不宜'];
      let avoid = ['诸事不宜'];
      // 获取万年历
      const apiRes = await getCalendar(new Date());
      console.log('apiRes', apiRes);
      suit = apiRes && apiRes['suit'] && apiRes['suit'].split('.') && apiRes['suit'].split('.').splice(0, 3);
      avoid = apiRes && apiRes['avoid'] && apiRes['avoid'].split('.') && apiRes['avoid'].split('.').splice(0, 3);
      const zodiac = parseZodiac(date);
      const constellation = parseConstellation(date);
      // 获取转运秘技
      const secretId = await getSecretId(json);
      console.log('secretId', secretId);
      // 获取是否好运
      const isGoodLuck = secretId % 2 == 0 ? false : true;
      this.setData({
        suit,
        avoid,
        zodiac,
        constellation,
        isGoodLuck,
        secret: json[secretId]['content']
      }, () => {
        console.log('this.data', this.data);
        wx.hideLoading();
      });
      const user_esoterica = {
        ...this.data
      }
      app.globalData.user_esoterica = user_esoterica;
      console.log('user_esoterica', user_esoterica);
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  nextPage: function() {
    wx.navigateTo({
      url: '../lightUp/lightUp',
    })
  },
  onShareAppMessage: function() {
    const openid = app.globalData.openid;
    return{
      title: `来自${this.data.userInfo.nickName}的运势分享`,
      path: `/pages/esoterica/esoterica?shared=true&openid=${openid}&user_esoterica=${JSON.stringify(app.globalData.user_esoterica)}`
    }
  }
});

Date.prototype.format = function(fmt) { //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}

function parseZodiac(date) {
  const year = date.format('yyyy');
  console.log('year', year);
  const id = parseInt(year) % 12;
  console.log('id', id);
  const map = ['猴','鸡','狗','猪','鼠','牛','虎','兔','龙','蛇','马','羊'];
  return map[id];
}

function parseConstellation(date) {
  const month = date.format('M');
  const day = date.format('d');
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
    return '水瓶座';
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return '双鱼座';
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
    return '白羊座';
  } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
    return '金牛座';
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) {
    return '双子座';
  } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
    return '巨蟹座';
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
    return '狮子座';
  } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
    return '处女座';
  } else if ((month == 9 && day >= 23) || (month == 10 && day <= 23)) {
    return '天秤座';
  } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
    return '天蝎座';
  } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
    return '射手座';
  } else {
    return '摩羯座';
  }
}

async function getCalendar(date) {
  let apiRet = null;
  const db = wx.cloud.database()
  const myDate = date.format('yyyy-M-d');
  // 判断是否有该记录
  const res = await db.collection('calendar').where({
    date: myDate
  }).get();
  if (res.data.length) {
    console.log('【数据库请求】【访问日历】 Success', myDate);
    return res.data[0]['data'];
  } else {
    console.log('【数据库请求】【访问日历】 Fail', myDate);
    const apiRes = await new Promise((resolve, reject) => {
      wx.request({
        url: 'https://v.juhe.cn/calendar/day', //仅为示例，并非真实的接口地址
        data: {
          date: myDate,
          key: '223f182aec00d3c88e07e8ced12f9b95'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        }
      });
    });
    apiRet = apiRes.data;
    console.log('apiRet', apiRet);
    if (apiRet.error_code != 0) {
      console.error('访问接口错误', apiRet);
      wx.navigateTo({
        url: '../index/index',
      });
    }
  }
  const ret = {
    ...apiRet['result']['data']
  };
  db.collection('calendar').add({
    data: {
      data: ret,
      date: myDate,
    },
    success: res => {
      console.log('[OnAdd] [数据库] [新增记录] 成功，记录 _id::', res._id)
    },
    fail: err => {
      console.error('[OnAdd] [数据库] [新增记录] 失败：', err)
      wx.navigateTo({
        url: '../idnex/index'
      })
    }
  });
  return ret;
}

async function getSecretId(json) {
  const db = wx.cloud.database()
  // 判断是否有该记录
  const res = await db.collection('secrets').where({
    _openid: app.globalData.openid
  }).get();
  if (res.data.length) {
    return res.data[0].secretId;
  } else {
    const secretId = Math.floor(Math.random() * 100000 % 200);
    await db.collection('secrets').add({
      data: {
        secretId,
        all: 1
      },
      success: res => {
        console.log('[saveUsers] [保存转运秘技] 成功 res::', res);
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '保存转运秘技'
        })
        console.error('[OnAdd] [数据库] [保存转运秘技] 失败：', err)
      }
    });
    return secretId;
  }
}