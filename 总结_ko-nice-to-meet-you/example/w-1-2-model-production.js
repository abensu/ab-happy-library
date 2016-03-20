/**
 * 模型-商品
 *
 * @public
 *  |- @param {string} raw          : [ {} ] 保存的原数据
 *  |- @param {string} name         : [ "" ] 商品名
 *  |- @param {string} pic          : [ "" ] 图片路径
 *  |- @param {number} prize        : [ 0 ] 单价
 *  |- @param {number} type         : [ 1 ] 分类（1：上衣；2：裤子；3：包袋）
 *  |- @param {number} sex          : [ 1 ] 性别（1：男；2：女）
 *  |- @param {ko::number} buyNum   : [ 0 ] 购买数量
 *  `- @param {function} cmd        : [ function(cmd, data) ] 命令函数
 *
 * @private
 *  `- @node {string} _name     : [ "ProductionViewModel" ] 模块名
 *
 * @param {object} rawData      : [ {} ] 参数对象（单个货物 json）
 *  |- @param {string} name     : [ "" ] 商品名
 *  |- @param {string} pic      : [ "" ] 图片路径
 *  |- @param {number} prize    : [ 0 ] 单价
 *  |- @param {number} type     : [ 1 ] 分类（1：上衣；2：裤子；3：包袋）
 *  `- @param {number} sex      : [ 1 ] 性别（1：男；2：女）
 */

var ProductionViewModel = function(rawData) {

    var self = this;

    // 继承通用基类
    BaseViewModel.apply(self);

    // 模块名
    self._name = "ProductionViewModel";

    // 保存的原数据
    self.raw = rawData || {};

    // 商品名
    self.name = self.raw.name || "";

    // 图片路径
    self.pic = self.raw.pic || "";

    // 单价
    self.prize = self.raw.prize || 0;

    // 分类（1：上衣；2：裤子；3：包袋）
    self.type = self.raw.type || 1;

    // 性别（1：男；2：女）
    self.sex = self.raw.sex || 1;

    // 购买数量
    self.buyNum = ko.observable(self.raw.buyNum || 0);
};

// 命令函数
ProductionViewModel.prototype.cmd = function(cmd, data) {

    var
        self    = this,
        reVal   = {cmd: self._name + "::" + cmd, status: 0, msg: "unknown cmd"}; // 返回数据

    switch(cmd) {

        // 设置（暂仅支持购买数量）
        // @param {number} data.buyNum : [ this.buyNum() ] 购买数量
        case "set" :

            var
                data    = data || {},
                buyNum  = data.buyNum == undefined || isNaN(data.buyNum) ? self.buyNum() : parseInt(data.buyNum);

            self.buyNum(buyNum);

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = {
                                    buyNum  : buyNum
                                };
            break;

        // 获取
        case "get" :

            reVal.status    = 1;
            reVal.msg       = "success";
            reVal.data      = {
                                    name    : self.name,
                                    pic     : self.pic,
                                    prize   : self.prize,
                                    type    : self.type,
                                    sex     : self.sex,
                                    buyNum  : self.buyNum()
                                };
            break;
    }

    // 输出 log 信息
    BaseViewModel.prototype.debug.call(self, reVal);

    return reVal;
};
