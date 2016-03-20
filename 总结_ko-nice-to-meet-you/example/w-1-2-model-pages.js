/**
 * 模型-分页区域
 *
 * @public
 *  |- @node {ko::array} pageList       : [ [] ] 页码列表
 *  |- @node {ko::number} curPage       : [ 0 ] 当前页码（从 0 开始）
 *  |- @node {number} eachNum           : [ 6 ] 每页元素的可展示个数
 *  |- @node {ko::boolean} prevVisState : [] 上一页可视状态
 *  |- @node {ko::boolean} nextVisState : [] 下一页可视状态
 *  `- @node {function} cmd             : [ function(cmd, data) ] 命令函数
 *
 * @prevVisState
 *  |- @node {string} _name     : [ "PagesViewModel" ] 模块名
 *  `- @node {object} _models   : [ {...} ] 依赖的 model
 *
 * @param {object} data         : [] 参数对象
 *  `- @node {object} PageModel : [] 页面模型
 */

var PagesViewModel = function(data) {

    var
        self = this,
        data = data || {};

    // 继承通用基类
    BaseViewModel.apply(self);

    // 模块名
    self._name = "PagesViewModel";

    // 依赖的 model
    self._models = { Page: data.PageModel };

    // 页码列表
    self.pageList = ko.observableArray();

    // 当前页码（从 0 开始）
    self.curPage = ko.observable(0);

    // 每页元素的可展示个数
    self.eachNum = 6;

    // 上一页可视状态
    self.prevVisState = ko.pureComputed(function() {
                                return self.curPage() > 0 && self.pageList().length > 1;
                            });

    // 下一页可视状态
    self.nextVisState = ko.pureComputed(function() {
                                return self.curPage() < self.pageList().length - 1;
                            });
};

// 命令函数
PagesViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        Page    = self._models.Page,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    var
        func_createPage,
        func_turnPage;

    // 创建页码（总页数必须大于 1），返回页码列表
    func_createPage = function(total, eachNum, Model) {

        var
            len     = Math.ceil(total / eachNum),
            arr     = [],
            i       = 0;

        if ( !isNaN(len) && len > 1 ) {

            for (; i < len; i++) {

                arr.push( new Model(i, !i) );
            }
        }

        return arr;
    };

    // 翻页（从 0 开始），返回新当前页码的实例
    func_turnPage = function(page, srcList, curPage) {

        var
            list    = srcList,
            len     = list.length,
            curPage = curPage,
            cell    = list[curPage];

        if (page < len && page !== curPage) {

            cell = list[page];

            list[curPage].cmd("set", {isCur: false});
            self.curPage(page);
            cell.cmd("set", {isCur: true});
        }

        return cell;
    };

    switch (cmd) {

        // 创建新的页码列表
        // @param {number} data.eachNum : [ this.eachNum ] 每页数量
        // @param {number} data.total   : [ 0 ] 总数
        case "set/newpages" :
            var
                data        = data || {},
                total       = data.total == undefined || isNaN(data.total) ? 0 : data.total & data.total,
                eachNum     = data.eachNum == undefined || isNaN(data.eachNum) ? self.eachNum : data.eachNum & data.eachNum,
                pageList    = func_createPage(total, eachNum, Page);

            self.pageList(pageList);

            func_turnPage( 0, self.pageList(), self.curPage() );

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = pageList;
            break;

        // 展示第几页（翻页）
        // @param {number} data.page : [ this.curPage() ] 页码
        case "show/page" :
            var
                data        = data || {},
                page        = data.page == undefined || isNaN(data.page) ? self.curPage() : data.page & data.page,
                curPage     = func_turnPage( page, self.pageList(), self.curPage() );

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = curPage;
            break;

        // 获取当前页码
        case "get/curpage" :

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.curPage();
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};