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
            text: '派单',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: true
        }, {
            text: '餐饮',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            text: '快递',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            text: '家教',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            text: '外卖',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }, {
            text: '实习',
            tagStyle: tagStyle,
            tagSelectedStyle: selectStyle,
            checked: false
        }],
        items: [{
            name: '1',
            checked: false
        }],
        showMask: false, // 服务协议查看
        agreement: {} // 用户服务协议
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
            title: { required: true },
            type: { required: true },
            money: { required: true },
            phone: { required: true, tel: true },
            content: { required: true }
            // 验证字段的提示信息，若不传则调用默认的信息
        };var messages = {
            title: { required: '请输入兼职标题！' },
            type: { required: '请选择资料所属类型！' },
            money: { required: '请输入基本工资！' },
            phone: { required: '请输入联系电话！', tel: '手机号格式错误！' },
            content: { required: '请输入职位描述！' }
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
            type: this.data.sourcestypes[opt].text,
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
            url: 'https://ck.taoyuantoday.com/mini/Index/getAgreement.html',
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
                title: '必须同意方寸奶爸服务协议才可继续。',
                icon: 'none'
            });
            return false;
        }
        wx.showLoading({
            title: '请稍后...',
            mask: true
        });
        wx.request({
            url: 'https://ck.taoyuantoday.com/mini/Weparttime/create.html',
            data: data,
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
                        duration: 3000
                    });
                    wx.navigateTo({
                        url: './index'
                    });
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