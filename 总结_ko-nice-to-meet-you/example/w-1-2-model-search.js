/**
 * 模型-搜索区域
 *
 * @public
 *  |- @node {ko::string} keyword   : [ "" ] 关键词
 *  |- @node {array} types          : [ [ ... ] ] 分类
 *  |                                   `- @cell
 *  |                                       |- @node {string} laebl     : [] 显示的字段
 *  |                                       `- @node {number} typeid    : [] 分类 ID
 *  |- @node {ko::number} typesNow  : [ 0 ] 当前分类 ID
 *  |- @node {array} sex            : [ [ ... ] ] 性别
 *  |                                   `- @cell
 *  |                                       |- @node {string} laebl     : [] 显示的字段
 *  |                                       `- @node {number} sexid     : [] 性别 ID
 *  |- @node {ko::number} sexNow    : [ 0 ] 当前性别 ID
 *  `- @node {function} cmd         : [ function(cmd, data) ] 命令函数
 *
 * @private
 *  `- @node {string} _name : [ "SearchViewModel" ] 模块名
 */

var SearchViewModel = function() {

    var self = this;

    BaseViewModel.apply(self);

    // 模块名
    self._name = "SearchViewModel";

    // 关键词
    self.keyword = ko.observable("");

    // 分类
    self.types = ko.observableArray([
                        {"label": "全部", "typeid": 0},
                        {"label": "上衣", "typeid": 1},
                        {"label": "裤子", "typeid": 2},
                        {"label": "包袋", "typeid": 3}
                    ]);

    // 当前分类 ID
    self.typesNow = ko.observable(0);

    // 性别
    self.sex = ko.observableArray([
                        {"label": "未知", "sexid": 0},
                        {"label": "男", "sexid": 1},
                        {"label": "女", "sexid": 2}
                    ]);

    // 性别（当前）
    self.sexNow = ko.observable(0);
};

// 命令函数
SearchViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    switch (cmd) {

        // 搜索
        case "search" :

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = {
                                    "keyword"   : self.keyword(),
                                    "typeid"    : self.typesNow(),
                                    "sexid"     : self.sexNow()
                                };
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};
