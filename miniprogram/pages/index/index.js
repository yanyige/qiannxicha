//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false, //等价与authed
    takeSession: false,
    requestResult: '',
    users: {
      date: null,
      gender: 'male'
    }
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.navigateTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          app.globalData.authed = true;
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
    })
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: async res => {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 从数据库中读取值
              const db = wx.cloud.database()
              db.collection('users').where({
                _openid: app.globalData.openid
              }).get({
                success: res => {
                  console.log('[Onload] [数据库] [查询记录] 成功: ', res)
                  if (res.data.length) {
                    this.setData({
                      users: {
                        date: res.data[0].date,
                        gender: res.data[0].gender
                      }
                    });
                    wx.showToast({
                      title: '授权成功',
                      icon: 'none'
                    });
                  }
                  this.setData({
                    logged: true
                  });
                },
                fail: err => {
                  console.error('[Onload] [数据库] [查询记录] 失败：', err)
                }
              });
            }
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  nextPage: async function() {
    console.log('logged', this.data.logged);
    if (!this.data.logged) {
      const that = this;
      wx.showModal({
        title: '签熹Chancec',
        content: '当前未授权，将使用游客身份进行体验',
        confirmText: '我要授权',
        cancelText: '确认',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showToast({
              icon: 'none',
              title: '点击页面上微信授权进行登陆~'
            })
          } else if (res.cancel) {
            console.log('用户点击取消');
            // 游客登陆
            that.login();
          }
        }
      });
    } else {
      this.login();
    }
  },

  onShareAppMessage: function() {
    const openid = app.globalData.openid;
    return{
      path: `/pages/index/index`
    }
  },

  login: async function(e) {
    if (!this.data.users.date || !this.data.users.gender) {
      wx.showToast({
        icon: 'none',
        title: '请先填写生日和性别哦~'
      })
    } else {
      if (!this.data.logged) { //如果没有授权
        app.globalData.guest = true;
      } else {
        app.globalData.guest = false;
      }
      console.log('app.globalData.guest', app.globalData.guest);
      console.log('[saveUsers] [保存用户信息]', this.data.users);
      const db = wx.cloud.database()
      // 判断是否有该记录
      const res = await db.collection('users').where({
        _openid: app.globalData.openid
      }).get();
      if (res.data.length) {
        wx.navigateTo({
          url: '../drawLots/drawLots'
        })
      } else {
        db.collection('users').add({
          data: {
            ...this.data.userInfo,
            ...this.data.users
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            console.log('[saveUsers] [保存用户信息] 成功 res::', res);
            console.log('[OnAdd] [数据库] [新增记录] 成功，记录 _id::', res._id)
            // 跳转到抓阄页面
            wx.navigateTo({
              url: '../drawLots/drawLots'
            })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '保存用户信息失败'
            })
            console.error('[OnAdd] [数据库] [新增记录] 失败：', err)
          }
        })
      }
    }
  },

  bindDateChange: function(e) {
    console.log('日期发生选择改变，携带值为', e.detail.value)
    const target = 'date';
    this.setData({
      [`users.${target}`]: e.detail.value
    })
  },
  
  bindChangeGender: function(e) {
    console.log('性别选择改变，携带值为', e.currentTarget.dataset['gender']);
    const target = 'gender';
    this.setData({
      [`users.${target}`]: e.currentTarget.dataset['gender']
    });
  }
})
