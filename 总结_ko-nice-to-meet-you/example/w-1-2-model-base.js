/**
 * 模型-购物车区域
 *
 * @public
 *  `- @node {function} debug   : [ function(data) ] 输出 log 信息（如果不支持 console.log 方法则不输出）
 *
 * @private
 *  |- @node {string} _name     : [ "BaseViewModel" ] 模块名
 *  `- @node {boolean} _debug   : [ false ] 是否开启输出 log
 */

var BaseViewModel = function() {

    var self = this;

    // 模块名
    self._name  = "BaseViewModel";

    // 是否开启输出 log
    self._debug = false;
};

// 输出 log 信息（如果不支持 console.log 方法则不输出）
BaseViewModel.prototype.debug = function(data) {

    var reVal;

    this._debug && console && ( reVal = data, console.log(reVal) );

    return reVal;
};