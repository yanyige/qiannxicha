// miniprogram/pages/shareCenter/shareCenter.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lightUpId: 0,
    shared: false,
    showDefault: false,
    itemImgs: [{
      id: 1,
      url: "http://qx.tkmao.com/wenchuang/pic/11.png"
    }, {
      id: 2,
      url: "http://qx.tkmao.com/wenchuang/pic/12.png"
    }, {
      id: 3,
      url: "http://qx.tkmao.com/wenchuang/pic/13.png"
    },{
      id: 4,
      url: "http://qx.tkmao.com/wenchuang/pic/14.png"
    }, {
      id: 5,
      url: "http://qx.tkmao.com/wenchuang/pic/15.png"
    }, {
      id: 6,
      url: "http://qx.tkmao.com/wenchuang/pic/16.png"
    },{
      id: 7,
      url: "http://qx.tkmao.com/wenchuang/pic/17.png"
    }, {
      id: 8,
      url: "http://qx.tkmao.com/wenchuang/pic/18.png"
    }, {
      id: 9,
      url: "http://qx.tkmao.com/wenchuang/pic/19.png"
    }],
    itemImgs1: [{
      id: 1,
      url: "http://qx.tkmao.com/wenchuang/pic/21.png"
    }, {
      id: 2,
      url: "http://qx.tkmao.com/wenchuang/pic/22.png"
    }, {
      id: 3,
      url: "http://qx.tkmao.com/wenchuang/pic/23.png"
    },{
      id: 4,
      url: "http://qx.tkmao.com/wenchuang/pic/24.png"
    }, {
      id: 5,
      url: "http://qx.tkmao.com/wenchuang/pic/25.png"
    }, {
      id: 6,
      url: "http://qx.tkmao.com/wenchuang/pic/26.png"
    },{
      id: 7,
      url: "http://qx.tkmao.com/wenchuang/pic/27.png"
    }, {
      id: 8,
      url: "http://qx.tkmao.com/wenchuang/pic/28.png"
    }, {
      id: 9,
      url: "http://qx.tkmao.com/wenchuang/pic/29.png"
    }],
    itemImgs2: [{
      id: 1,
      url: "http://qx.tkmao.com/wenchuang/pic/31.png"
    }, {
      id: 2,
      url: "http://qx.tkmao.com/wenchuang/pic/32.png"
    }, {
      id: 3,
      url: "http://qx.tkmao.com/wenchuang/pic/33.png"
    },{
      id: 4,
      url: "http://qx.tkmao.com/wenchuang/pic/34.png"
    }, {
      id: 5,
      url: "http://qx.tkmao.com/wenchuang/pic/35.png"
    }, {
      id: 6,
      url: "http://qx.tkmao.com/wenchuang/pic/36.png"
    },{
      id: 7,
      url: "http://qx.tkmao.com/wenchuang/pic/37.png"
    }, {
      id: 8,
      url: "http://qx.tkmao.com/wenchuang/pic/38.png"
    }, {
      id: 9,
      url: "http://qx.tkmao.com/wenchuang/pic/39.png"
    }],
    tab1: { // 第一列当前显示的图片
      id: 1,
      url: "http://qx.tkmao.com/wenchuang/pic/11.png"
    },
    tab2: { // 第二列当前显示的图片
      id: 2,
      url: "http://qx.tkmao.com/wenchuang/pic/21.png"
    },
    tab3: { // 第三列当前显示的图片
      id: 3,
      url: "http://qx.tkmao.com/wenchuang/pic/31.png"
    },
    animationData1: {}, // 第一列动画
    animationData2: {}, // 第二列动画
    animationData3: {}, // 第三列动画
    // 保存结果，将每一列的结果保存下来，如果有三个值，，说明摇奖结束
    resNum: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading...',
    })
    const lightUpId = app.globalData.lightUpId;
    console.log('lightUpId', lightUpId);
    const shared = options.shared
    this.setData({
      shared,
      lightUpId
    }, () => {
      wx.hideLoading();
    })
    this.getAnmiation();
  },

  shareEsoterica: function() {
    const openid = app.globalData.openid;
    wx.navigateTo({
      url: `../esoterica/esoterica?shared=true&openid=${openid}&user_esoterica=${JSON.stringify(app.globalData.user_esoterica)}`,
    });
  },
  coupon: function() {
    // wx.navigateTo({
    //   url: '../out/out',
    // });
    wx.navigateToMiniProgram({
      appId: 'wxca878755feb58368',
      path: '/pages/home/pinpaijie?id=32',
      extraData: {
        foo: 'bar'
      },
      success(res) {
        // 打开成功
        console.log("navigate success");
      }
    })
  },
  shareSmell: function() {
    wx.navigateTo({
      url: `../shareCenter/shareCenter?shared=true`,
    });
  },
  /* 
   *"抽奖点击事件"
   */
  getAnmiation: function () {
    // 隐藏默认图片
    this.setData({
      showDefault: true,
      resNum: [] // 将结果数组置为空
    })

    this.getOpenAnimation(1, this.data.lightUpId); // 第一个动画
    this.getOpenAnimation(2, this.data.lightUpId); // 第二个动画
    this.getOpenAnimation(3, this.data.lightUpId); // 第二个动画

    var page = this;
    // 校验最终的游戏结果，如果三个结果值都有值，并且全部一致，视为中奖，不一样，视为未中奖
    var resTime = setInterval(function () {
      if (page.data.resNum.length > 3) {
        // 延迟1秒给出提示
        clearInterval(resTime);
      }
    }, 1000);
  },
  /**
   * 处理动画动作
   */
  getOpenAnimation: function (line, resNum) {
    var page = this;
    // 创建动画
    let animation = wx.createAnimation({
      duration: 300, // 执行一次动画的时间
      timingFunction: 'ease', // 动画的效果，平滑
    })

    // 随即生成摇奖区滚动的总共时长，范围5000-6000
    let randomTotalTime = Math.random() * 1000 + 5000;
    randomTotalTime = parseInt(randomTotalTime, 10);

    // 随即生成每次循环间隔的时间,500-600之间的随机数
    let tempRandom = Math.random() * 300 + 250;
    tempRandom = parseInt(tempRandom, 10);

    let num = 0; // 设定计数标签，从0开始
    let count = 1; // 循环计数
    // 设定循环
    let loop = setInterval(function () {
      num++; // 每次循环加1
      count++;
      if (num > 2) {
        // 如果计数标签大于2，置为0
        num = 0;
      }
      if (count * tempRandom >= randomTotalTime) {
        // 到达预定的时间点，停止循环，将图片定位到显示区域中间位置
        animation.translateY(85).step({
          duration: 0
        });
        handleSet(page, true);

        count = 0;
        // 更新结果数组
        let tempArr = page.data.resNum;
        tempArr.push(resNum);
        page.setData({
          resNum: tempArr
        })
        clearInterval(loop); // 停止循环
      } else {
        animation.translateY(300).step().translateY(0).step({
          duration: 0
        });
        handleSet(page);
      }

      function handleSet(page, last = false) {
        if (last) {
          num = resNum;
        }
        if (line === 1) {
          page.setData({
            tab1: page.data.itemImgs[num], // 修改显示的图片
            animationData1: animation.export()
          })
        } else if (line === 2) {
          page.setData({
            tab2: page.data.itemImgs1[num], // 修改显示的图片
            animationData2: animation.export()
          })
        } else if (line === 3) {
          page.setData({
            tab3: page.data.itemImgs2[num], // 修改显示的图片
            animationData3: animation.export()
          })
        }
      }
    }, tempRandom);
  }
})