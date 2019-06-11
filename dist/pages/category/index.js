'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        DEFAULT_HEADER_HEIGHT: wx.DEFAULT_HEADER_HEIGHT,
        headTitle: ['分享', '经验', '爱问知识人'], //顶部选择标题
        checkedId: 0, //顶部选择序号Id
        list: [{ title: '互联网', type: ['PHP', 'JAVA', 'javascript', 'PHP', 'JAVA', 'javascript'] }, { title: '服务业', type: ['PHP', 'JAVA', 'javascript', 'PHP', 'JAVA', 'javascript'] }, { title: '机械业', type: ['PHP', 'JAVA', 'javascript', 'PHP', 'JAVA', 'javascript'] }],
        list1: [{ title: '666', type: ['PHP', 'JAVA', 'javascript', 'PHP', 'JAVA', 'javascript11'] }, { title: '666888', type: ['PHP', 'JAVA', 'javascript', 'PHP', 'JAVA', 'javascript'] }, { title: '机械业', type: ['PHP', 'JAVA', 'javascript', 'PHP', 'JAVA', 'javascript'] }]
    },
    // 顶部选择
    check: function check(e) {
        this.setData({
            checkedId: e.currentTarget.dataset.sid
        });
    }
});