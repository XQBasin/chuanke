'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var tagStyle = '\n  padding: 0 20rpx;\n  text-align: center;\n  height: 70rpx;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  line-height: 70rpx;\n  margin: 14rpx 0;\n  border:1px solid #c7c7c7;\n  border-radius: 50rpx;\n';
var selectStyle = '\n  padding: 0 20rpx;\n  text-align: center;\n  height: 70rpx;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  line-height: 70rpx;\n  margin: 14rpx 0;\n  font-weight: bold;\n  border-radius: 50rpx;\n  background:#007BFF;\n  color:#fff;\n';
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
    if (startDot.X - touchDot.X > 150 && startDot.Y - touchDot.Y < 100 && time < 5 && time > 0.1) {
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
    if (touchDot.X - startDot.X > 150 && touchDot.Y - startDot.Y < 100 && time < 5 && time > 0.1) {
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
    console.log("结束触屏");
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
            url: 'https://ck.taoyuantoday.com/mini/Index/wxQuickLogin.html',
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

  // 获取用户基本信息
  bindGetUserInfo: function bindGetUserInfo(e) {
    var that = this;
    var route = e.currentTarget.dataset.route;
    var authorise = e.currentTarget.dataset.authorise;
    // 判断是否同意授权
    if (e.detail.userInfo == undefined) {
      wx.showModal({
        title: '温馨提示',
        content: '请先允许授权再继续！',
        showCancel: false,
        confirmColor: '#ffd100',
        confirmText: '我知道啦',
        success: function success(res) {
          if (res.confirm) {
            console.log('用户已确认看到提示！');
          }
        }
      });
    } else {
      that.updateUser(e.detail.userInfo, that.data.uid, route, authorise);
    }
  },

  // 更新用户信息
  updateUser: function updateUser(userInfo, uid, route, authorise) {
    var that = this;
    wx.request({
      url: 'https://ck.taoyuantoday.com/mini/Index/updateUser.html',
      data: {
        userInfo: userInfo,
        uid: uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function success(res) {
        that.navigateTo(route, authorise);
      }
    });
  },
  // 获取路由页面
  navigateTo: function navigateTo(route, authorise) {
    var that = this;
    // 若实名认证则再判断是否认证通过，若通过则正常路由，否则跳转至审核提示页
    if (authorise) {
      that.checkAuthenticApply(that.data.uid, route);
    } else {
      wx.navigateTo({
        url: '../upload/' + route + "?uid=" + that.data.uid
      });
    }
  },
  // 获取用户基本信息
  checkAuthenticApply: function checkAuthenticApply(uid, route) {
    var that = this;
    wx.request({
      url: 'https://ck.taoyuantoday.com/mini/Index/getUserInfoById.html',
      data: {
        uid: uid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function success(res) {
        if (res.data) {
          wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Index/authenticApply.html',
            data: {
              id: res.data.authenticid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
              if (res.data) {
                if (res.data.status) {
                  wx.navigateTo({
                    url: '../upload/' + route + '?uid=' + that.data.uid
                  });
                } else {
                  wx.navigateTo({
                    url: '../upload/authstat?uid=' + that.data.uid
                  });
                }
              } else {
                wx.navigateTo({
                  url: '../upload/authentic?uid=' + that.data.uid
                });
              }
            }
          });
        }
      }
    });
  }
});