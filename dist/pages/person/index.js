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
    },

    // 获取用户基本信息
    bindGetUserInfo: function bindGetUserInfo(e) {
        var that = this;
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
            that.updateUser(e.detail.userInfo, that.data.uid);
        }
    },

    // 更新用户信息
    updateUser: function updateUser(userInfo, uid) {
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
                console.log('用户信息更新成功！');
            }
        });
    }
});