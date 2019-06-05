'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT
    },
    onLoad: function onLoad(options) {
        wx.showShareMenu({
            withShareTicket: true
        });
    },
    remind: function remind(e) {
        wx.showModal({
            title: '温馨提示',
            content: '我们已通知审核人员快速处理，请耐心等待！',
            showCancel: false,
            confirmColor: '#ffd100',
            confirmText: '确认',
            success: function success(res) {
                if (res.confirm) {
                    wx.navigateBack();
                }
            }
        });
    },

    // 客服消息
    handleContact: function handleContact(e) {
        console.log(e.path);
        console.log(e.query);
    },

    // 导航返回
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});