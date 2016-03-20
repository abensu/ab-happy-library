/**
 * 模型-购物车区域
 *
 * @public
 *  |- @node {ko::array} cartList       : [ [] ] 购物车列表
 *  |- @node {ko::number} totalPrize    : [ 0 ] 总价
 *  `- @node {function} cmd             : [ function(cmd, data) ] 命令函数
 */

var CartViewModel = function() {

    var self = this;

    // 继承通用基类
    BaseViewModel.apply(self);

    // 模块名
    self._name = "CartViewModel";

    // 购物车列表
    self.cartList = ko.observableArray();

    // 总价
    self.totalPrize = ko.observable(0);
};

// 命令函数
CartViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    switch (cmd) {

        // 添加到购物车
        // @param {object} data.ele : [] 某商品的实例
        case "add" :

            var
                curPrize    = self.totalPrize(),
                ele         = data.ele,
                eleInfo     = ele.cmd("get").data,
                nowNum      = 1,
                nowPrize    = curPrize + eleInfo.prize * nowNum;

            ele.cmd("set", {buyNum: nowNum});

            self.cartList.unshift(ele);
            self.totalPrize(nowPrize);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.cartList();
            break;

        // 从购物车删除
        // @param {object} data.ele : [] 某商品的实例
        case "remove" :

            var
                curPrize    = self.totalPrize(),
                ele         = data.ele,
                eleInfo     = ele.cmd("get").data,
                buyNum      = eleInfo.buyNum,
                nowPrize    = curPrize - eleInfo.prize * buyNum;

            ele.cmd("set", {buyNum: 0});

            self.cartList.remove(ele);
            self.totalPrize(nowPrize);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.cartList();
            break;

        // 获取记录
        case "get" :

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.cartList();
            break;

        // 购买数量增加 或 购买数量减少
        // @param {object} data.ele : [] 某商品的实例
        case "up" :
        case "down" :

            var
                curPrize    = self.totalPrize(),
                ele         = data.ele,
                eleInfo     = ele.cmd("get").data,
                baseNum     = cmd === "up" ? 1 : -1,
                prize       = eleInfo.prize,
                buyNum      = eleInfo.buyNum,
                nowNum      = buyNum + baseNum,
                nowPrize    = curPrize + prize * baseNum;

            ele.cmd("set", {buyNum: nowNum});

            !nowNum && self.cartList.remove(ele);
            self.totalPrize(nowPrize);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = self.cartList();
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};