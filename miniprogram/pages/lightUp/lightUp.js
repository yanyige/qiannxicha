// miniprogram/pages/drawLots/drawLots.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lots: null,
    openid: null,
    lightUpId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const json = require('../../static/lots');
    const lightUpId = Math.floor(Math.random() * 100000 % 9);
    app.globalData.lightUpId = lightUpId;
    this.setData({
      lightUpId,
      lots: json,
      openid: app.globalData.openid
    });
  },
  
  nextPage: function(event) {
    const idx = event.currentTarget.dataset.index;
    if (idx == app.globalData.lightUpId) {
      wx.navigateTo({
        url: '../shareCenter/shareCenter',
      });
    } else {
      wx.showToast({
        title: '点击亮着的罐子调味～',
        icon: 'none'
      })
    }
  }
})