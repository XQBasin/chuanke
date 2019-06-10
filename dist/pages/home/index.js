'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 触屏开始点坐标
var startDot = {
  X: 0,
  Y: 0
};
// 触屏到点坐标
var touchDot = {
  X: 0,
  Y: 0
};
var time = 0; // 触屏时间
var number; // 定时器ID
exports.default = Page({
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
    uid: '', // 当前用户标识
    headTitle: ['分享', '经验', '爱问知识人'], // 顶部选择标题
    checkedId: 0, // 顶部选择序号Id
    list: [{ title: 'php中文网vip特权会员学习指南', img: '../../static/image/home/create.png' }, { title: '2019春招PHP面试题（附答案）', img: '../../static/image/home/create.png' }, { title: 'PHP使用统计和市场定位最新报告', img: '../../static/image/home/create.png' }, { title: 'php中文网《玉女心经》公益PHP培训系列课程汇总', img: '../../static/image/home/create.png' }],
    show: false,
    animatebtngroup: 'animatebtngroup',
    isHideLoadMore: true, //加载更多状态
    touchanimate: 'animated rubberBand'
  },
  onLoad: function onLoad(options) {
    // 自动登录并返回登录信息
    this.autoLogin(this);
    // 获取兼职列表
    // this.getRecommpart(1)
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 顶部选择
  check: function check(e) {
    this.setData({
      checkedId: e.currentTarget.dataset.sid
    });
  },

  // 打开发布按钮
  openAnimate: function openAnimate(e) {
    var that = this;
    var show = that.data.show;
    if (!show) {
      that.setData({
        show: !show,
        animatebtngroup: 'animated fadeInUp'
      });
    } else {
      that.setData({
        animatebtngroup: 'animated fadeOutDown'
      });
      setTimeout(function () {
        that.setData({
          show: !show
        });
      }, 700);
    }
  },

  /**
   * 触屏开始计时和获取坐标
   */
  touchStart: function touchStart(event) {
    startDot.X = event.touches[0].pageX;
    startDot.Y = event.touches[0].pageY;
    number = setInterval(function () {
      time++;
    }, 100);
  },
  /**
   * 判断滑动距离和时间是否需要切换页面
   */
  touchMove: function touchMove(event) {
    touchDot.X = event.touches[0].pageX;
    touchDot.Y = event.touches[0].pageY;
    //向左滑处理
    if (startDot.X - touchDot.X > 50 && startDot.Y - touchDot.Y < 10 && time < 5 && time > 0.1) {
      if (this.data.checkedId < this.data.headTitle.length - 1) {
        this.setData({
          checkedId: this.data.checkedId + 1,
          touchanimate: 'animated fadeInRight'
        });
      }
      if (this.data.checkedId == this.data.headTitle.length - 1) {
        this.setData({
          checkedId: this.data.headTitle.length - 1,
          touchanimate: 'animated rubberBand'
        });
      }
      clearInterval(number);
      time = 0;
    }
    //向右滑处理
    if (touchDot.X - startDot.X > 50 && touchDot.Y - startDot.Y < 10 && time < 5 && time > 0.1) {
      if (this.data.checkedId < this.data.headTitle.length && this.data.checkedId > 0) {
        this.setData({
          checkedId: this.data.checkedId - 1,
          touchanimate: 'animated fadeInLeft'
        });
      }
      if (this.data.checkedId == 0) {
        this.setData({
          touchanimate: 'animated rubberBand'
        });
      }
      clearInterval(number);
      time = 0;
    }
  },
  /**
   * 结束触屏重置计时
   */
  touchEnd: function touchEnd(event) {
    clearInterval(number);
    time = 0;
  },
  // 自动登录
  autoLogin: function autoLogin(thisobj) {
    wx.login({
      success: function success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Index/autoRegist.html',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
              if (res.data) {
                thisobj.setData({
                  uid: res.data
                });
              }
            }
          });
        } else {
          console.log('登录失败，请检查网络设置！' + res.errMsg);
        }
      }
    });
  },

  // 获取路由页面
  navigateTo: function navigateTo(e) {
    var that = this;
    var route = e.currentTarget.dataset.route;
    var authorise = e.currentTarget.dataset.authorise;
    // 若实名认证则再判断是否认证通过，若通过则正常路由，否则跳转至审核提示页
    if (authorise) {
      that.checkAuthenticApply(that.data.uid, route);
    } else {
      wx.navigateTo({
        url: '../' + route + "?uid=" + that.data.uid
      });
    }
  },
  // 判断实名认证导航
  checkAuthenticApply: function checkAuthenticApply(uid, route) {
    try {
      // 优先从缓存中获取
      var authid = wx.getStorageSync('authid');
      if (authid) {
        // Do something with return value
        wx.navigateTo({
          url: '../' + route + '?uid=' + uid
        });
      } else {
        wx.request({
          url: 'https://ck.taoyuantoday.com/mini/Index/authenticApply.html',
          data: {
            uid: uid
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function success(res) {
            if (res.data.id) {
              if (res.data.status) {
                // 写入缓存
                wx.setStorage({
                  key: "authid",
                  data: res.data.id
                });
                wx.navigateTo({
                  url: '../' + route + '?uid=' + uid
                });
              } else {
                wx.navigateTo({
                  url: '../person/authstat?uid=' + uid
                });
              }
            } else {
              wx.navigateTo({
                url: '../person/authentic?uid=' + uid
              });
            }
          }
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  }
});