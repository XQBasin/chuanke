'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT
    },
    // 导航返回
    navigateBack: function navigateBack() {
        wx.navigateBack();
    }
});