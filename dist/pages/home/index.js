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
    headTitle: ['分享', '爱问知识人'], // 顶部选择标题
    checkedId: 0, // 顶部选择序号Id
    shares: [], // 分享列表
    shareField: [], // 分享条件字段
    shareCurrentPage: 1, // 当前页码
    sharePageSzie: 2, // 分享页面大小
    shareTotalPage: 0, // 总页码
    isHideShareLoadMore: false, // 加载更多分享状态
    questions: [], // 提问列表
    questField: [], // 分享条件字段
    questCurrentPage: 1, // 当前页码
    questPageSzie: 2, // 分享页面大小
    questTotalPage: 0, // 总页码
    isHideQuestLoadMore: false, // 加载更多分享状态
    show: false,
    animatebtngroup: 'animatebtngroup',
    touchanimate: 'animated bounce'
  },
  onLoad: function onLoad(options) {
    // 自动登录并返回登录信息
    this.autoRegist(this);
    // 获取活动列表
    this.getSharesForPage(this.data.shareField, this.data.shareCurrentPage);
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 顶部选择
  check: function check(e) {
    var checkedId = e.currentTarget.dataset.sid;
    this.setData({
      checkedId: checkedId
    });
    this.swipper(checkedId);
  },

  // 滑动加载
  swipper: function swipper(index) {
    switch (index) {
      case 0:
        this.getSharesForPage(this.data.shareField, 1);
        break;
      case 1:
        this.getQuestionsForPage(this.data.questField, 1);
        break;
      default:
    }
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
        this.swipper(this.data.checkedId);
      }
      if (this.data.checkedId == this.data.headTitle.length - 1) {
        this.setData({
          checkedId: this.data.headTitle.length - 1,
          touchanimate: 'animated bounce'
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
          touchanimate: 'animated bounce'
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
  // 自动注册并返回注册标识
  autoRegist: function autoRegist(thisobj) {
    wx.login({
      success: function success(res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Index/autoRegist',
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
  },
  //下拉刷新
  onPullDownRefresh: function onPullDownRefresh() {
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    //模拟加载
    this.swipper(this.data.checkedId);
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1500);
  },
  //加载更多
  onReachBottom: function onReachBottom() {
    switch (this.data.checkedId) {
      case 0:
        if (this.data.shareCurrentPage >= this.data.shareTotalPage) {
          this.setData({
            isHideShareLoadMore: true
          });
        } else {
          this.getSharesForPage(this.data.shareField, parseInt(this.data.shareCurrentPage) + 1, true);
        }
        break;
      case 1:
        if (this.data.questCurrentPage >= this.data.questTotalPage) {
          this.setData({
            isHideQuestLoadMore: true
          });
        } else {
          this.getQuestionsForPage(this.data.questField, parseInt(this.data.questCurrentPage) + 1, true);
        }
        break;
      default:
    }
  },
  // 活动列表
  getSharesForPage: function getSharesForPage(field, currentPage, concat) {
    var that = this;
    wx.request({
      url: 'https://ck.taoyuantoday.com/mini/Share/getSharesForPage',
      data: {
        field: field,
        currentPage: currentPage,
        pageSzie: that.data.sharePageSzie
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function success(res) {
        if (res.data.state) {
          if (concat) {
            that.setData({
              shareCurrentPage: res.data.currentPage,
              shares: that.data.shares.concat(res.data.shares),
              shareTotalPage: res.data.totalPage
            });
          } else {
            that.setData({
              shares: null
            });
            that.setData({
              shareCurrentPage: res.data.currentPage,
              shares: res.data.shares,
              shareTotalPage: res.data.totalPage
            });
          }
        } else {
          that.setData({
            shares: null
          });
          that.setData({
            shareCurrentPage: res.data.currentPage,
            shares: res.data.shares,
            shareTotalPage: res.data.totalPage
          });
        }
      }
    });
  },
  // 活动列表
  getQuestionsForPage: function getQuestionsForPage(field, currentPage, concat) {
    var that = this;
    wx.request({
      url: 'https://ck.taoyuantoday.com/mini/Question/getQuestionsForPage',
      data: {
        field: field,
        currentPage: currentPage,
        pageSzie: that.data.questPageSzie
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function success(res) {
        if (res.data.state) {
          if (concat) {
            that.setData({
              questCurrentPage: res.data.currentPage,
              questions: that.data.questions.concat(res.data.questions),
              questTotalPage: res.data.totalPage
            });
          } else {
            that.setData({
              questions: null
            });
            that.setData({
              questCurrentPage: res.data.currentPage,
              questions: res.data.questions,
              questTotalPage: res.data.totalPage
            });
          }
        } else {
          that.setData({
            questions: null
          });
          that.setData({
            questCurrentPage: res.data.currentPage,
            questions: res.data.questions,
            questTotalPage: res.data.totalPage
          });
        }
      }
    });
  },
  // 查看社交信息详情
  getQuestionInfo: function getQuestionInfo(option) {
    var questionid = option.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../question/comments?questionid=' + questionid
    });
  },
  // 客服消息回调
  handleContact: function handleContact(e) {
    console.log(e.path);
    console.log(e.query);
  }
});