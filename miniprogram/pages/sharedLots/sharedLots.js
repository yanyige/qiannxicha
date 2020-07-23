// miniprogram/pages/sharedLots/sharedLots.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    lotId: null,
    lot: null,
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const json = require('../../static/lots');
    this.setData({
      lotId: options.lotId,
      openid: getApp().globalData.openid,
      lot: json[options.lotId],
      userName: options.userName
    });
  },

  onShareAppMessage: function (res) {
    console.log('userinfo', this.data.userInfo);
    return {
      title: `${this.data.userName}的运势分享`,
      path: `/pages/sharedLots/sharedLots?userName=${this.data.userName}&lotId=${this.data.lotId}`
    };
  },

  getNew: async function() {
    wx.navigateTo({
      url: '../index/index',
    })
  }
})