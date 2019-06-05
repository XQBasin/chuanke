'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commonUtil = require('../../static/utils/common.util.js');

var _WxValidate = require('../../static/utils/WxValidate.js');

var _WxValidate2 = _interopRequireDefault(_WxValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
        uid: '', // 用户标识
        localPositive: '', // 正面证件照本地路径
        serverPositive: '', // 正面证件照网络路径
        localReverse: '', // 反面证件照本地路径
        serverReverse: '' // 反面证件照本地路径
    },
    onLoad: function onLoad(options) {
        (0, _commonUtil.$init)(this);
        if (options.uid) {
            this.setData({
                uid: options.uid
            });
        }
        this.initValidate();
        wx.showShareMenu({
            withShareTicket: true
        });
    },

    // 初始化表单校验
    initValidate: function initValidate() {
        // 验证字段的规则
        var rules = {
            name: {
                required: true
            },
            idcard: {
                required: true,
                idcard: true
            },
            positive: {
                required: true
            },
            reverse: {
                required: true
            }
            // 验证字段的提示信息，若不传则调用默认的信息
        };var messages = {
            name: {
                required: '真实姓名不予许为空！'
            },
            idcard: {
                required: '请输入15或18位身份证号码！',
                idcard: '身份证号格式不正确！'
            },
            positive: {
                required: '正面证照不予许为空！'
            },
            reverse: {
                required: '反面证照不允许为空！'
            }
            // 创建实例对象
        };this.validate = new _WxValidate2.default(rules, messages);
    },
    choosePositive: function choosePositive(e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function success(res) {
                var images = res.tempFilePaths;
                that.data.localPositive = images[0];
                wx.uploadFile({
                    url: 'https://ck.taoyuantoday.com/mini/Upload/alone', //仅为示例，非真实的接口地址
                    filePath: images[0],
                    name: 'file',
                    success: function success(res) {
                        var result = JSON.parse(res.data);
                        that.data.serverPositive = result.url;
                        (0, _commonUtil.$digest)(that);
                    }
                });
            }
        });
    },
    chooseReverse: function chooseReverse(e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function success(res) {
                var images = res.tempFilePaths;
                that.data.localReverse = images[0];
                wx.uploadFile({
                    url: 'https://ck.taoyuantoday.com/mini/Upload/alone', //仅为示例，非真实的接口地址
                    filePath: images[0],
                    name: 'file',
                    success: function success(res) {
                        var result = JSON.parse(res.data);
                        that.data.serverReverse = result.url;
                        (0, _commonUtil.$digest)(that);
                    }
                });
            }
        });
    },
    formSubmit: function formSubmit(e) {
        var that = this;
        var data = e.detail.value;
        // 校验表单
        if (!this.validate.checkForm(data)) {
            var error = this.validate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none'
            });
            return false;
        }
        wx.showLoading({
            title: '请稍后...',
            mask: true
        });
        wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Index/authenticApply.html',
            data: {
                uid: data.uid,
                name: data.name,
                idcard: data.idcard,
                positive: data.positive,
                reverse: data.reverse
            },
            header: {
                'Content-Type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: "POST",
            success: function success(res) {
                if (res.data.state) {
                    wx.hideLoading();
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    });
                    wx.navigateTo({
                        url: './authstat'
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
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