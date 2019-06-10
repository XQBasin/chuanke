'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _commonUtil = require('../../static/utils/common.util.js');

var _WxValidate = require('../../static/utils/WxValidate.js');

var _WxValidate2 = _interopRequireDefault(_WxValidate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tagStyle = 'background: #eee;\n    color: #888;\n    border-radius: 3px;\n    text-align: center;\n    height: 30px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin-top: 10px;\n    ';
var selectStyle = 'background: #fff;\n    color: #007BFF;\n    border: 1px solid #007BFF;\n    border-radius: 3px;\n    text-align: center;\n    height: 30px;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin-top: 10px;\n    ';
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
        uid: '', // 用户标识
        titleCount: 0, // 标题字数
        contentCount: 0, // 详情描述字数
        localSrc: '', // 资料图本地路径
        serverSrc: '', // 资料图服务器路径
        onFocus: false, // textarea焦点是否选中
        isShowText: false, // 控制显示 textarea 还是 text
        typepopshow: false, // 兼职pop是否显示
        sourcestypes: [{
            id: 1,
            text: '派单',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: true
        }, {
            id: 2,
            text: '餐饮',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            id: 3,
            text: '快递',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            id: 4,
            text: '家教',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            id: 5,
            text: '外卖',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            id: 6,
            text: '实习',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }],
        items: [{
            name: '1',
            checked: false
        }],
        type: 1, // 默认资料类型
        typetext: '', // 资料类型描述
        showMask: false, // 服务协议查看
        windowWidth: 0, // 系统屏幕宽度
        windowHeight: 0, // 系统屏幕高度
        agreement: {} // 用户服务协议
    },
    onLoad: function onLoad(options) {
        this.getSystemInfo();
        this.initValidate();
        (0, _commonUtil.$init)(this);
        if (options.uid) {
            this.setData({
                uid: options.uid
            });
        }
    },

    // 获取系统参数
    getSystemInfo: function getSystemInfo() {
        var that = this;
        wx.getSystemInfo({
            success: function success(res) {
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                });
            }
        });
    },

    // 资料宣传图片选择
    chooseImage: function chooseImage(e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: function success(res) {
                var images = res.tempFilePaths;
                that.data.localSrc = images[0];
                wx.uploadFile({
                    url: 'https://ck.taoyuantoday.com/mini/Upload/alone', //仅为示例，非真实的接口地址
                    filePath: images[0],
                    name: 'file',
                    success: function success(res) {
                        var result = JSON.parse(res.data);
                        that.data.serverSrc = result.url;
                        (0, _commonUtil.$digest)(that);
                    }
                });
            }
        });
    },

    // 初始化表单校验
    initValidate: function initValidate() {
        // 验证字段的规则
        var rules = {
            title: { required: true },
            type: { required: true },
            phone: { required: true, tel: true },
            content: { required: true }
            // 验证字段的提示信息，若不传则调用默认的信息
        };var messages = {
            title: { required: '资料标题不允许为空！' },
            type: { required: '请选择资料所属分类！' },
            phone: { required: '请输入联系电话！', tel: '手机号格式错误！' },
            content: { required: '请输入资料简介或描述！' }
            // 创建实例对象
        };this.validate = new _WxValidate2.default(rules, messages);
    },
    handleTitleInput: function handleTitleInput(e) {
        var value = e.detail.value;
        this.data.title = value;
        this.data.titleCount = value.length; //计算已输入的标题字数
        (0, _commonUtil.$digest)(this);
    },
    handleContentInput: function handleContentInput(e) {
        var value = e.detail.value;
        this.data.content = value;
        this.data.contentCount = value.length; //计算已输入的正文字数
        (0, _commonUtil.$digest)(this);
    },
    onShowTextare: function onShowTextare() {
        //显示textare
        this.data.isShowText = false;
        this.data.onFacus = true;
        (0, _commonUtil.$digest)(this);
    },
    onShowText: function onShowText() {
        // 显示text
        this.data.isShowText = true;
        this.data.onFacus = false;
        (0, _commonUtil.$digest)(this);
    },
    onContentInput: function onContentInput(event) {
        // 保存输入框填写内容
        var value = event.detail.value;
        this.data.content = value;
        this.data.isShowText = true;
        this.data.onFacus = false;
        (0, _commonUtil.$digest)(this);
    },
    checkboxChange: function checkboxChange(e) {
        var value = e.detail.value;
        this.data.agree = value.length;
        (0, _commonUtil.$digest)(this);
    },

    // POP类型选择弹框
    openPopup: function openPopup(e) {
        var poptype = e.currentTarget.dataset.poptype;
        switch (poptype) {
            case 'type':
                this.setData({ typepopshow: true });
                break;
            default:
                this.setData({ show: true });
        }
    },

    // 类型弹框数据回填
    singleTapType: function singleTapType(e) {
        var opt = e.detail.index;
        this.data.sourcestypes.forEach(function (item, index) {
            item.checked = index === opt;
        });
        this.setData({
            type: this.data.sourcestypes[opt].id,
            typetext: this.data.sourcestypes[opt].text,
            sourcestypes: this.data.sourcestypes,
            typepopshow: false
        });
    },

    // 服务协议展示
    handleShowMask: function handleShowMask() {
        this.setData({
            showMask: true
        });
        this.getAgreement(1);
    },
    getAgreement: function getAgreement(id) {
        var that = this;
        wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Share/getAgreement',
            data: {
                id: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (res.data) {
                    that.setData({
                        agreement: res.data
                    });
                }
            }
        });
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
        if (!data.agree[0]) {
            wx.showToast({
                title: '必须同意传客用户服务协议才可发布。',
                icon: 'none'
            });
            return false;
        }
        data.type = this.data.type;
        wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Share/create',
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