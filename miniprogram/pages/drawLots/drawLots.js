// miniprogram/pages/drawLots/drawLots.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    lots: null,
    openid: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const json = require('../../static/lots');
    this.setData({
      lots: json,
      openid: app.globalData.openid
    })
  },
  
  nextPage: function(event) {
    wx.navigateTo({
      url: '../esoterica/esoterica',
    })
  }
})