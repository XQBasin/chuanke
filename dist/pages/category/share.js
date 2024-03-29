'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var tagStyle = '\n  padding: 0 20rpx;\n  text-align: center;\n  height: 70rpx;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  line-height: 70rpx;\n  margin: 14rpx 0;\n  border:1px solid #c7c7c7;\n  border-radius: 50rpx;\n';
var selectStyle = '\n  padding: 0 20rpx;\n  text-align: center;\n  height: 70rpx;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  line-height: 70rpx;\n  margin: 14rpx 0;\n  font-weight: bold;\n  border-radius: 50rpx;\n  background:#007BFF;\n  color:#fff;\n';

exports.default = Page({
  data: {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
    list: [{ title: 'php中文网vip特权会员学习指南', img: '../../static/image/home/create.png' }, { title: '2019春招PHP面试题（附答案）', img: '../../static/image/home/create.png' }, { title: 'PHP使用统计和市场定位最新报告', img: '../../static/image/home/create.png' }, { title: 'php中文网《玉女心经》公益PHP培训系列课程汇总', img: '../../static/image/home/create.png' }],
    show: false,
    maskStyle: {
      'top': '198px'
    },
    list00: [{
      text: '全部活动',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: true
    }, {
      text: '电脑办公',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '精选活动',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '个护美妆',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '家用电器',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '酒水饮料',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '日用百货',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '流行服饰',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '鞋靴箱包',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '手机数码',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }, {
      text: '钟表珠宝',
      tagStyle: tagStyle,
      tagSelectedStyle: selectStyle,
      checked: false
    }],
    isHideLoadMore: true //加载更多状态
  },
  //打开分类组件
  openPopup: function openPopup(e) {
    var show = e.currentTarget.dataset.show;
    this.setData({
      show: show
    });
  },

  //获取选择选项
  singleTap: function singleTap(e) {
    var opt = e.detail.index;
    wx.showToast({
      title: this.data.list00[opt].text,
      icon: 'none'
    });
    this.data.list00.forEach(function (item, index) {
      item.checked = index === opt;
    });
    this.setData({
      show: false,
      list00: this.data.list00
    });
  },

  // 跳转到搜索页面
  toSearch: function toSearch() {
    wx.navigateTo({ url: '/pages/home/search' });
  }
});