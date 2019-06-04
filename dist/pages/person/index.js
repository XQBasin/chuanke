'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT
    },
    // 路由跳转
    navigateToShow: function navigateToShow(e) {
        var route = e.currentTarget.dataset.route;
        wx.navigateTo({
            url: '../person/' + route
        });
    }
});