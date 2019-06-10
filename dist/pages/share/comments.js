'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
        uid: '', // 用户标识
        social: {}, // 消息对象
        fixedNav: '', // 绝对定位关闭
        fixedHid: true, // 导航占位影藏
        index: 0, // tab初始索引
        socialid: '', // 消息标识
        comfilm: [], // 初始显示论坛数据
        comfield: [], // 条件字段标识
        comcurrentpage: 1, // 当前页码
        comtotalNum: 0, // 总评论数量
        comtotalPage: 0, // 总页码
        isHideComLoadMore: false, // 默认显示加载更多
        sharfilm: [], // 论坛数据对象
        lovefilm: [], // 论坛数据对象
        place: '', // 默认回复提示
        level: 1, // 默认评论等级
        content: '', // 评论内容
        plshow: false, // 是否显示评论组件
        zfshow: false, // 是否显示转发组件
        zface: '', // 默认转发提示
        plfocus: false, // 评论框是否自动获得焦点
        zffocus: false, // 转发框是否自动获得焦点
        cpid: 0, // 评论消息标识
        open: 'true', // 默认开启匿名
        activeTabStyle: {
            'color': '#ffd100',
            'font-size': '17px',
            'font-weight': 600
        }
    },
    onLoad: function onLoad(options) {
        // 自动登录并返回登录信息
        this.autoLogin(this);
        // 获取消息详情
        this.getSocial(options.socialid);
        // 分页获取评论列表
        this.setData({
            socialid: options.socialid,
            comfield: this.data.comfield.concat({
                key: 'status',
                value: 1
            }, {
                key: 'parentid',
                value: 0
            })
        });
        this.getCommentsForPage(this.data.comfield, options.socialid, this.data.comcurrentpage);
        wx.showShareMenu({
            withShareTicket: true
        });
    },

    // 自动登录
    autoLogin: function autoLogin(thisobj) {
        wx.login({
            success: function success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: 'https://wx.taoyuantoday.com/mini.Wesocial/wxQuickLogin.html',
                        data: {
                            code: res.code
                        },
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: function success(res) {
                            if (res.data) {
                                thisobj.setData({
                                    uid: res.data
                                });
                            }
                        }
                    });
                } else {
                    console.log('登录失败，请检查网络设置！' + res.errMsg);
                }
            }
        });
    },

    //下拉刷新
    onPullDownRefresh: function onPullDownRefresh() {
        wx.showNavigationBarLoading(); //在标题栏中显示加载
        //模拟加载
        this.getCommentsForPage(this.data.comfield, this.data.socialid, 1);
        setTimeout(function () {
            // complete
            wx.hideNavigationBarLoading(); //完成停止加载
            wx.stopPullDownRefresh(); //停止下拉刷新
        }, 1500);
    },
    //加载更多
    onReachBottom: function onReachBottom() {
        if (this.data.comcurrentpage >= this.data.comtotalPage) {
            this.setData({
                isHideComLoadMore: true
            });
        } else {
            this.getCommentsForPage(this.data.comfield, this.data.socialid, parseInt(this.data.comcurrentpage) + 1, true);
        }
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
                confirmColor: '#FFD100',
                confirmText: '我知道啦',
                success: function success(res) {
                    if (res.confirm) {
                        console.log('用户已确认看到提示！');
                    }
                }
            });
        } else {
            that.updateUser(e.detail.userInfo, that.data.uid, e);
        }
    },

    // 用户开放信息记录
    updateUser: function updateUser(userInfo, uid, e) {
        var that = this;
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/updateUser.html',
            data: {
                userInfo: userInfo,
                uid: uid
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (e.currentTarget.dataset.bindtap == "openPLPopup") {
                    that.openPLPopup(e);
                } else if (e.currentTarget.dataset.bindtap == "openZFPopup") {
                    that.openZFPopup(e);
                } else {
                    that.giveLike(e);
                }
            }
        });
    },
    // 消息详情
    getSocial: function getSocial(socialid) {
        var that = this;
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/getSocial.html',
            data: {
                socialid: socialid
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (res.data) {
                    that.setData({
                        social: res.data
                    });
                }
            }
        });
    },
    previewImage: function previewImage(e) {
        var urls = e.currentTarget.dataset.urls;
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        });
    },
    handleChange: function handleChange(e) {
        var index = e.detail.index;
        this.setData({
            index: index
        });
        switch (index) {
            case 0:
                if (this.data.comfilm.length == 0) {
                    this.getCommentsForPage(this.data.comfield, this.data.socialid, 1);
                }
                break;
            case 1:
                if (this.data.sharfilm.length == 0) {
                    // 以后根据需要调整为分页查询
                    this.getShares(this.data.socialid);
                }
                break;
            case 2:
                if (this.data.lovefilm.length == 0) {
                    // 以后根据需要调整为分页查询
                    this.getLikes(this.data.socialid);
                }
                break;
            default:
        }
    },
    onPageScroll: function onPageScroll(e) {
        var _this = this;

        var query = wx.createSelectorQuery();
        query.select('#tabitems').boundingClientRect(function (rect) {
            var top = rect.top;
            if (top <= _this.data.NAV_HEIGHT + 66) {
                // 临界值，根据自己的需求来调整
                _this.setData({
                    fixedNav: 'fixedClass', // 是否固定导航栏
                    fixedHid: false // 导航占位显示
                });
            } else {
                _this.setData({
                    fixedNav: '', // 清除固定导航样式表
                    fixedHid: true // 导航占位影藏
                });
            }
        }).exec();
    },

    // 打开评论组件
    openPLPopup: function openPLPopup(e) {
        var plshow = e.currentTarget.dataset.plshow;
        var parentid = e.currentTarget.dataset.parentid;
        var touser = e.currentTarget.dataset.touser;
        var level = e.currentTarget.dataset.level;
        this.setData({
            plshow: plshow,
            plfocus: true,
            cpid: parentid,
            place: touser,
            level: level,
            content: ''
        });
    },

    // 打开转发组件
    openZFPopup: function openZFPopup(e) {
        var zfshow = e.currentTarget.dataset.zfshow;
        var touser = e.currentTarget.dataset.touser;
        this.setData({
            zfshow: zfshow,
            zffocus: true,
            zface: touser,
            content: ''
        });
    },

    // 提交评论
    plFormSubmit: function plFormSubmit(e) {
        var that = this;
        var data = e.detail.value;
        if (that.data.level == 2) {
            var content = data + that.data.place;
        } else {
            var content = data;
        }
        // 校验表单
        if (!content) {
            wx.showToast({
                title: '至少说点什么吧！',
                icon: 'none'
            });
            return false;
        }
        wx.showLoading({
            title: '请稍后...',
            mask: true
        });
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/comments.html',
            data: {
                uid: that.data.uid,
                socialid: that.data.social.id,
                content: content,
                parentid: that.data.cpid,
                open: that.data.open
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
                    that.getCommentsForPage(that.data.comfield, that.data.socialid, 1);
                    that.setData({
                        plshow: false
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                    that.setData({
                        plshow: false
                    });
                }
            }
        });
    },
    // 提交转发
    zfFormSubmit: function zfFormSubmit(e) {
        var that = this;
        var data = e.detail.value;
        var content = data;
        wx.showLoading({
            title: '请稍后...',
            mask: true
        });
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/share.html',
            data: {
                uid: that.data.uid,
                socialid: that.data.social.id,
                content: content,
                open: that.data.open
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
                    that.getShares(that.data.social.id);
                    that.setData({
                        zfshow: false
                    });
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000
                    });
                    that.setData({
                        zfshow: false
                    });
                }
            }
        });
    },
    // 点赞
    giveLike: function giveLike(e) {
        var that = this;
        var socialid = that.data.social.id;
        var uid = that.data.uid;
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/giveLike.html',
            data: {
                socialid: socialid,
                uid: uid
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (res.data.state) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'success',
                        duration: 2000
                    });
                    that.getLikes(socialid);
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
    // 分页获取评论列表
    getCommentsForPage: function getCommentsForPage(comfield, socialid, comcurrentpage, concat) {
        var that = this;
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/getCommentsForPage.html',
            data: {
                comfield: comfield,
                socialid: socialid,
                comcurrentpage: comcurrentpage
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (res.data.state) {
                    if (concat) {
                        that.setData({
                            comcurrentpage: res.data.comcurrentpage,
                            comfilm: that.data.comfilm.concat(res.data.comfilm),
                            comtotalNum: res.data.comtotalNum,
                            comtotalPage: res.data.comtotalPage
                        });
                    } else {
                        that.setData({
                            comfilm: null
                        });
                        that.setData({
                            comcurrentpage: res.data.comcurrentpage,
                            comfilm: res.data.comfilm,
                            comtotalNum: res.data.comtotalNum,
                            comtotalPage: res.data.comtotalPage
                        });
                    }
                }
                if (that.data.comcurrentpage >= that.data.comtotalPage) {
                    that.setData({
                        isHideComLoadMore: true
                    });
                }
            }
        });
    },
    // 转发列表
    getShares: function getShares(socialid) {
        var that = this;
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/getShares.html',
            data: {
                socialid: socialid
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (res.data) {
                    that.setData({
                        sharfilm: res.data
                    });
                }
            }
        });
    },
    // 点赞列表
    getLikes: function getLikes(socialid) {
        var that = this;
        wx.request({
            url: 'https://wx.taoyuantoday.com/mini.Wesocial/getLikes.html',
            data: {
                socialid: socialid
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function success(res) {
                if (res.data) {
                    that.setData({
                        lovefilm: res.data
                    });
                }
            }
        });
    },
    // 匿名状态更改
    openChange: function openChange(e) {
        var value = e.detail.value;
        this.setData({
            open: value
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