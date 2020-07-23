// pages/userConsole/userConsole.js
Page({

  data: {
    openid: '',
    registered: false,
    gender: ['男', '女'],
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载用户信息中',
    })
    this.setData({
      openid: getApp().globalData.openid
    })

    if (getApp().globalData.openid) {
      console.log('getApp().globalData.openid::', getApp().globalData.openid);
      const db = wx.cloud.database();
      // 查询当前用户所有的 userinfo
      db.collection('userinfo').where({
        _openid: getApp().globalData.openid
      }).get({
        success: res => {
          console.log('[Onload] [数据库] [查询记录] 成功: ', res)
          if (res.data.length) {
            this.setData({
              registered: true
            });
            // 跳转到抓阄页面
            wx.navigateTo({
              url: '../drawLots/drawLots'
            })
          }
          wx.hideLoading();
        },
        fail: err => {
          console.error('[Onload] [数据库] [查询记录] 失败：', err)
        }
      });
    }
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('userinfo').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[OnQuery] [数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[OnQuery] [数据库] [查询记录] 失败：', err)
      }
    })
  },

  bindRadioChange: function(e) {
    console.log('性别发生选择改变', e.detail.value)
    const target = 'gender';
    this.setData({
      [`userinfo.${target}`]: this.data.gender[e.detail.value]
    })
  },

  bindDateChange: function(e) {
    console.log('日期发生选择改变，携带值为', e.detail.value)
    const target = 'date';
    this.setData({
      [`userinfo.${target}`]: e.detail.value
    })
  },

  bindHeightChange: function(e) {
      console.log('身高发生选择改变，携带值为', e.detail.value);
      const target = 'height';
      this.setData({
        [`userinfo.${target}`]: e.detail.value
      })
  },

  bingWeightChange:  function(e) {
    console.log('体重发生选择改变，携带值为', e.detail.value);
    const target = 'weight';
    this.setData({
      [`userinfo.${target}`]: e.detail.value
    })
  },

  saveUserInfo: function(e) {
    console.log('[saveUserInfo] [保存用户信息]');
    const db = wx.cloud.database()
    db.collection('userinfo').add({
      data: {
        ...this.data.userinfo
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        console.log('[saveUserInfo] [保存用户信息] 成功 res::', res);
        wx.showToast({
          title: '保存信息成功',
        })
        console.log('[OnAdd] [数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 跳转到抓阄页面
        wx.navigateTo({
          url: '../drawLots/drawLots'
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '保存信息失败失败'
        })
        console.error('[OnAdd] [数据库] [新增记录] 失败：', err)
      }
    })
  }
})