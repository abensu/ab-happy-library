/**
 * 模型-列表区域
 *
 * @public
 *  |- @node {array} storeList      : [ [] ] 缓存的数据列表
 *  |- @node {ko::array} showList   : [ [] ] 展示的数据列表
 *  |- @node {array} eachNum        : [ 6 ] 每页展示数量
 *  `- @node {function} cmd         : [ function(cmd, data) ] 命令函数
 *
 * @private
 *  `- @node {string} _name     : [ "ListViewModel" ] 模块名
 */

var ListViewModel = function() {

    var self = this;

    // 继承通用基类
    BaseViewModel.apply(self);

    // 模块名
    self._name = "ListViewModel";

    // 缓存的数据列表
    self.storeList = [];

    // 展示的数据列表 
    self.showList = ko.observableArray();

    // 每页展示数量
    self.eachNum = 6;
};

// 命令函数
ListViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    switch (cmd) {

        // 新的列表
        // @param {array} data.dataList : [ [] ] 数据列表
        case "set/newlist" :

            var newList = data.dataList || [];

            self.storeList.length = 0;
            self.showList.removeAll();

            self.storeList = newList;
            self.showList( newList.slice(0, self.eachNum) );

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = newList;
            break;

        // 根据分页，展示对应的数据
        // @param {number} data.eachNum : [ this.eachNum ] 每页个数
        // @param {number} data.page    : [ 0 ] 页码
        case "show/page" :
            var
                page        = data.page || 0,
                eachNum     = data.eachNum || self.eachNum,
                startIndex  = page * eachNum,
                endIndex    = startIndex + eachNum,
                newList     = self.storeList.slice(startIndex, endIndex);

            self.showList(newList);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = newList;
            break;

        // 渲染
        // @param {array} data  : [] DOM 列表
        case "render/item" :

            var
                nodes   = data;
                node    = nodes.length > 1 ? nodes[1] : nodes[0];

            // 保护 node ，防止只有最后一个元素才执行 remove 操作
            (function(node) {
                node.classList.add("fn_transparent");
                setTimeout(function() {
                    node.classList.remove("fn_transparent");
                }, 10);
            })(node);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = node;
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};