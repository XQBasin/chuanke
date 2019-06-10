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
        titleCount: 0, // 标题字数
        contentCount: 0, // 正文字数
        id: '', // 活动标识
        onFocus: false, // textarea焦点是否选中
        uid: '', // 用户标识
        files: [], // 文件列表
        count: 6, // 最多可以选择的图片张数
        serverSrc: [], // 文件服务器路径
        open: 'true' // 默认开启匿名
    },
    onLoad: function onLoad(options) {
        this.initValidate();
        (0, _commonUtil.$init)(this);
        if (options.uid) {
            this.setData({
                uid: options.uid
            });
        }
    },

    // 初始化表单校验
    initValidate: function initValidate() {
        // 验证字段的规则
        var rules = {
            content: { required: true }
            // 验证字段的提示信息，若不传则调用默认的信息
        };var messages = {
            content: { required: '问题描述不予许为空！' }
            // 创建实例对象
        };this.validate = new _WxValidate2.default(rules, messages);
    },
    handleContentInput: function handleContentInput(e) {
        var value = e.detail.value;
        this.data.content = value;
        this.data.contentCount = value.length; //计算已输入的正文字数
        (0, _commonUtil.$digest)(this);
    },

    chooseImage: function chooseImage(e) {
        var that = this;
        wx.chooseImage({
            count: '{{count}}',
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function success(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                if (that.data.files.concat(res.tempFilePaths).length <= that.data.count) {
                    that.setData({
                        files: that.data.files.concat(res.tempFilePaths)
                    });
                    var images = res.tempFilePaths;
                    images.forEach(function (image) {
                        console.log(image);
                        wx.uploadFile({
                            url: 'https://ck.taoyuantoday.com/mini/Upload/alone', //仅为示例，非真实的接口地址
                            filePath: image,
                            name: 'file',
                            success: function success(res) {
                                var result = JSON.parse(res.data);
                                that.data.serverSrc = that.data.serverSrc.concat(result.url);
                                (0, _commonUtil.$digest)(that);
                            }
                        });
                    });
                } else {
                    wx.showToast({
                        title: '最多允许上传 ' + that.data.count + ' 张图片',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        });
    },
    previewImage: function previewImage(e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        });
    },
    removeImage: function removeImage(e) {
        var idx = e.target.dataset.idx;
        this.data.images.splice(idx, 1);
        (0, _commonUtil.$digest)(this);
    },
    formSubmit: function formSubmit(e) {
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
            url: 'https://ck.taoyuantoday.com/mini/Question/create',
            data: data,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: "POST",
            success: function success(res) {
                if (res.data.state) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 3000
                    });
                    wx.navigateBack();
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 3000
                    });
                }
            }
        });
    },

    openChange: function openChange(e) {
        var value = e.detail.value;
        this.data.open = value;
        (0, _commonUtil.$digest)(this);
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