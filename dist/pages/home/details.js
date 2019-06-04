'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Page({
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
    list: [{ title: 'php中文网vip特权会员学习指南', img: '../../static/image/home/create.png' }, { title: '2019春招PHP面试题（附答案）', img: '../../static/image/home/create.png' }, { title: 'PHP使用统计和市场定位最新报告', img: '../../static/image/home/create.png' }, { title: 'php中文网《玉女心经》公益PHP培训系列课程汇总', img: '../../static/image/home/create.png' }],
    catalog: [{ title: '一级目录', son: ['二级目录', '二级目录', '二级目录'] }, { title: '一级目录', son: ['二级目录', '二级目录', '二级目录'] }, { title: '一级目录', son: ['二级目录', '二级目录', '二级目录'] }],
    show: false,
    plshow: false, // 是否显示评论组件
    content: '', // 评论内容
    place: '' // 默认回复提示
  },
  // 导航返回
  navigateBack: function navigateBack() {
    wx.navigateBack();
  },
  onReachBottom: function onReachBottom() {
    console.log(1);
  },

  // 目录是否显示
  isShow: function isShow(e) {
    console.log(e);
    this.setData({
      show: e.currentTarget.dataset.show
    });
  },

  //打开评论组件
  openPL: function openPL(e) {
    this.setData({
      plshow: e.currentTarget.dataset.plshow,
      place: e.currentTarget.dataset.touser
    });
  },

  // 提交评论
  plFormSubmit: function plFormSubmit(e) {
    // var that = this
    // var data = e.detail.value
    // if (that.data.level == 2) {
    //     var content = data.content + that.data.place
    // } else {
    //     var content = data.content
    // }
    // // 校验表单
    // if (!that.validate.checkForm(data)) {
    //     const error = that.validate.errorList[0];
    //     wx.showToast({
    //         title: error.msg,
    //         icon: 'none'
    //     })
    //     return false
    // }
    // wx.showLoading({
    //     title: '请稍后...',
    //     mask: true
    // })
    // wx.request({
    //     url: 'https://wx.taoyuantoday.com/mini.Wesocial/comments.html',
    //     data: {
    //         uid: that.data.uid,
    //         socialid: that.data.social.id,
    //         content: content,
    //         parentid: that.data.cpid
    //     },
    //     header: {
    //         'Content-Type': 'application/x-www-form-urlencoded'     // 默认值
    //     },
    //     method: "POST",
    //     success(res) {
    //         if (res.data.state) {
    //             wx.hideLoading()
    //             wx.showToast({
    //                 title: res.data.message,
    //                 icon: 'success',
    //                 duration: 2000
    //             })
    //             that.getCommentsForPage(that.data.comfield, that.data.socialid, 1)
    //             that.setData({
    //                 plshow:false
    //             })
    //         } else {
    //             wx.showToast({
    //                 title: res.data.message,
    //                 icon: 'none',
    //                 duration: 2000
    //             })
    //             that.setData({
    //                 plshow:false
    //             })
    //         }
    //     }
    // })
  }
});