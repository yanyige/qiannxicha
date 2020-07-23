// miniprogram/pages/drawLots/drawLots.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lots: null,
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const json = require('../../static/lots');
    this.setData({
      lots: json,
      openid: getApp().globalData.openid
    })
  },
  
  bindOpenLot: function(event) {
    const openId = getApp().globalData.openid;
    const db = wx.cloud.database();
    // 查询数据库
    if (getApp().globalData.openid) {
      console.log('使用的openid::', openId);
      // 查询当前用户所有的 userinfo
      db.collection('userlots').where({
        _openid: openId
      }).get({
        success: res => {
          console.log('[Onload] [数据库] [查询记录] 成功: ', res)
          if (res.data.length) {
            app.globalData.lotId = res.data[0].index;
            app.globalData.newLot = false;
            // 跳转到展示页面
            wx.navigateTo({
              url: '../showLots/showLots'
            })
          } else {
            console.log('event data', event.currentTarget.dataset)
            app.globalData.lotId = this.data.lots[event.currentTarget.dataset.index]['id'];
            app.globalData.newLot = true;
      
            console.log('app.globalData.lotId', app.globalData.lotId);
            db.collection('userlots').add({
              data: {
                index: event.currentTarget.dataset.index
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                console.log('[saveUserInfo] [保存用户信息] 成功 res::', res);
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '保存信息失败失败'
                })
                console.error('[OnAdd] [数据库] [新增记录] 失败：', err)
              }
            })
            wx.navigateTo({
              url: '../showLots/showLots',
            })
          }
        },
        fail: err => {
          console.error('[Onload] [数据库] [查询记录] 失败：', err)
        }
      });
    }
  }
})