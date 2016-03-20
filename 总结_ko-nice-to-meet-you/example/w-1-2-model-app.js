/**
 * 模型-整体应用
 *
 * @public
 *  |- @node {object} Search    : [] 搜索模型
 *  |- @node {object} List      : [] 列表模型
 *  |- @node {object} Pages     : [] 分页模型
 *  |- @node {object} Cart      : [] 购物车模型
 *  |- @node {object} Store     : [] 缓存模型
 *  `- @node {function} cmd     : [ function(cmd, data) ] 命令函数
 *
 * @private
 *  `- @node {string} _name     : [ "AppViewModel" ] 模块名
 *
 * @param {object} data         : [ {} ] 参数对象
 *  |- @node {object} Search    : [] 搜索的实例
 *  |- @node {object} List      : [] 展示列表的实例
 *  |- @node {object} Pages     : [] 分页的实例
 *  |- @node {object} Cart      : [] 购物车的实例
 *  `- @node {object} Store     : [] 缓存的实例
 */

var AppViewModel = function(data) {

    var
        data = data || {},
        self = this;

    // 继承通用基类
    BaseViewModel.apply(self);

    // 模块名
    self._name  = "AppViewModel";

    // 搜索的实例
    self.Search = data.Search;

    // 展示列表的实例
    self.List = data.List;

    // 分页的实例
    self.Pages = data.Pages;

    // 购物车的实例
    self.Cart = data.Cart;

    // 缓存的实例
    self.Store = data.Store;
};

// 命令函数
AppViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this;
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    switch (cmd) {

        // 搜索
        case "search" :

            var
                searchParams = {},
                searchData,
                pageData;

            // 获取搜索的对象
            searchData = self.Search.cmd("search").data;

            // 组织新的合适的查询对象
            searchData.keyword && ( searchParams.name = function(val) { return !!val.match(searchData.keyword) } );
            searchData.sexid && (searchParams.sex = searchData.sexid);
            searchData.typeid && (searchParams.type = searchData.typeid);

            // 查询获取对应数据
            pageData = self.Store.cmd("find", searchParams).data;

            // 注入数据到展示列表
            self.List.cmd("set/newlist", {dataList: pageData});

            // 分页更新
            self.Pages.cmd("set/newpages", {total: pageData.length});

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = {searchParams: searchParams, pageData: pageData};
            break;

        // 翻页
        // @param {number} data.page : [] 页码
        case "page" :

            // 注入数据到展示列表
            self.List.cmd("show/page", {page: data.page});

            // 分页更新
            self.Pages.cmd("show/page", {page: data.page});

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = data.page;
            break;

        // 上一页 或 下一页
        case "prevpage" :
        case "nextpage" :

            var
                curPage = self.Pages.cmd("get/curpage").data,
                baseNum = cmd === "prevpage" ? -1 : 1,
                newPage = curPage + baseNum;

            // 注入数据到展示列表
            self.List.cmd("show/page", {page: newPage});

            // 分页更新
            self.Pages.cmd("show/page", {page: newPage});

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = newPage;
            break;

        // 购买 或 取消购买
        // @param {object} data : [] 某商品的实例
        case "buyopt" :

            var
                buyNum  = data.cmd("get").data.buyNum,
                cmd     = buyNum > 0 ? "remove" : "add";

            self.Cart.cmd(cmd, {ele: data});

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = "call '" + cmd + "' to descendants";
            break;

        // 添加数量 或 减少数量
        // @param {object} data : [] 某商品的实例
        case "up" :
        case "down" :

            self.Cart.cmd(cmd, {ele: data});

            reVal.status    = 1;
            reVal.msg       = "success";
            break;

        // 确定购买
        case "buynow" :

            var
                list        = self.Cart.cmd("get").data,
                len         = list.length,
                i           = 0,
                txt         = "",
                isOK        = false,
                totalPrize  = 0,
                cell;

            for (; i < len; i++) {

                cell = list[i].cmd("get").data;

                txt += "品名: " + cell.name + ", 单价: " + cell.prize + ", 数量: " + cell.buyNum + ";\n";

                totalPrize += cell.prize * cell.buyNum;
            }

            txt = txt ?
                    "确认购买以下商品:\n" + txt + "合计: " + totalPrize:
                    "你还没有购买任何东西（づ￣3￣）づ╭❤～";

            isOK = confirm(txt);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = isOK;
            break;

        // 初始化
        // @param {array} data.dataList : [ [] ] 货品列表
        case "init" :

            var
                data        = data || {},
                dataList    = data.dataList instanceof Array ? data.dataList : [];

            // 添加数据
            self.Store.cmd("init", {dataList: dataList});

            // 初次查询
            self.cmd("search");
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};
