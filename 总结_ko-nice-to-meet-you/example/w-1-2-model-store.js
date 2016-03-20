/**
 * 模型-储存区域
 *
 * @public
 *  |- @node {array} store  : [ [] ] 缓存的数据列表
 *  `- @node {function} cmd : [ function(cmd, data) ] 命令函数
 *
 * @private
 *  |- @node {string} _name     : [ "StoreViewModel" ] 模块名
 *  `- @node {object} _models   : [ {...} ] 依赖的模块
 *
 * @param {object} data                     : [] 参数对象
 *  `- @param {object} data.ProductionModel : [] 商品模型
 */

var StoreViewModel = function(data) {

    var
        self = this,
        data = data;

    BaseViewModel.apply(self);

    // 模块名
    self._name = "StoreViewModel";

    // 依赖的模块
    self._models = { Production: data.ProductionModel };

    // 缓存
    self.store = [];
};

// 命令函数
StoreViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    var
        func_disposeEachItem,
        func_find;

    // 处理每一个项目（商品）,使其成为可以使用的 view model
    func_disposeEachItem = function(list, Model) {

        var
            len     = 0,
            arr     = [],
            i       = 0;

        if (list && list.length) {

            for (len = list.length; i < len; i++) {

                arr.push( new Model(list[i]) );
            }
        }

        return arr;
    };

    // 查找对应参数的数据，返回列表
    func_find = function(param, srcList) {

        var
            len     = srcList && srcList.length ? srcList.length : 0,
            arr     = [],
            i       = len,
            isMatch = true,
            key,
            cell;

        if (len) {

            for (; i--;) {

                cell    = srcList[i];
                isMatch = true;

                for (key in param) {

                    if (key in cell) {

                        if (param[key] instanceof RegExp) { // 正则匹配

                            isMatch = param[key].test(cell[key]);

                        } else if (typeof param[key] === "function") { // 函数匹配

                            isMatch = !!param[key](cell[key]);

                        } else { // 值匹配

                            isMatch = param[key] === cell[key];
                        }

                        // 如果有不匹配则退出
                        if (!isMatch) { break; }
                    }
                }

                // 有匹配则添加到数组
                isMatch && arr.push(cell);
            }
        }

        return arr;
    };

    switch (cmd) {

        // 初始化
        // @param {array} data.dataList : [] 数据列表
        case "init" :

            self.store.length   = 0;
            self.store          = func_disposeEachItem(data.dataList, self._models.Production);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.store;
            break;

        // 添加新数列
        // @param {array} data.dataList : [] 数据列表
        case "add" :

            self.store = self.store.concat( func_disposeEachItem(data.dataList, self._models.Production) );

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.store;
            break;

        // 查找
        case "find" :

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = func_find(data, self.store);
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};