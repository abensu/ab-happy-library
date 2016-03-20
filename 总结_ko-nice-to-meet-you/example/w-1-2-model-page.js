/**
 * 模型-页码
 *
 * @public
 *  |- @node {number} page          : [ 0 ] 页码
 *  |- @node {ko::boolean} isCur    : [ 0 ] 是否为当前页状态
 *  `- @node {function} cmd         : [ function(cmd, data) ] 命令函数
 *
 * @param {number} page     : [ 0 ] 页码
 * @param {boolean} isCur   : [ false ] 是否为当前页状态
 */

var PageViewModel = function(page, isCur) {

    var self = this;

    // 继承通用基类
    BaseViewModel.apply(self);

    // 模块名
    self._name  = "PageViewModel";

    // 页码
    self.page = page || 0;

    // 是否为当前页状态
    self.isCur  = ko.observable(isCur || false);
};

// 命令函数
PageViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    switch (cmd) {

        // 设置（仅支持设置当前或非当前页面状态）
        // @param {boolean} data.isCur : [ this.isCur() ] 当前状态
        case "set" :

            var isCur = data && ("isCur" in data) ? !!data.isCur : self.isCur();

            self.isCur(isCur);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = isCur;
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};