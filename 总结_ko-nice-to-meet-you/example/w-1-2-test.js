/**
 * BaseViewModel
 */

(function() {

    QUnit.module("Ⅰ BaseViewModel");

    QUnit.test("debug(data) => 设置 this._debug 为 true 时，输出 data 信息", function(assert) {

        var model = new BaseViewModel();

        model._debug = true;

        assert.equal(model.debug(456), 456, "值通过");
    });

    QUnit.test("debug(data) => 设置 this._debug 为 false 时，输出 undefined", function(assert) {

        var model = new BaseViewModel();

        model._debug = false;

        assert.equal(model.debug(456), undefined, "值通过");
    });

})();


/**
 * PageViewModel
 */

(function() {

    QUnit.module("Ⅱ PageViewModel");

    QUnit.test("cmd(\"no exist cmd\") => 输入不存在的命令，返回错误状态", function(assert) {

        var model = new PageViewModel();

        assert.equal(model.cmd("no exist cmd").status, 0, "状态值通过");
    });

    QUnit.test("cmd(\"set\") => 不传入参数，this.isCur 为原值", function(assert) {

        var
            model = new PageViewModel(),
            prev  = model.isCur(),
            reVal = model.cmd("set");

        assert.equal(prev, model.isCur(), "前后值比对通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"set\", data) => 传入 data 为 {isCur: true}，设置 this.isCur 为 true", function(assert) {

        var
            model = new PageViewModel(),
            reVal = model.cmd("set", {isCur: true});

        assert.equal(model.isCur(), true, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"set\", data) => 传入 data 为 { isCur: false}，设置 this.isCur 为 true", function(assert) {

        var
            model = new PageViewModel(),
            reVal = model.cmd("set", {isCur: false});

        assert.equal(model.isCur(), false, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"set\", data) => 传入 data 为 { isCur: 1 }，设置 this.isCur 为 true", function(assert) {

        var
            model = new PageViewModel(),
            reVal = model.cmd("set", {isCur: 1});

        assert.equal(model.isCur(), 1, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"set\", data) => 传入 data 为 { isCur: null }，设置 this.isCur 为 true", function(assert) {

        var
            model = new PageViewModel(),
            reVal = model.cmd("set", {isCur: null});

        assert.equal(model.isCur(), false, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

})();


/**
 * ProductionViewModel
 */

(function() {

    QUnit.module("Ⅲ ProductionViewModel");

    QUnit.test("cmd(\"no exist cmd\") => 输入不存在的命令，返回错误状态", function(assert) {

        var model = new ProductionViewModel();

        assert.equal(model.cmd("no exist cmd").status, 0, "状态值通过");
    });

    QUnit.test("cmd(\"set\") => 不传入参数，this.buyNum 为原值", function(assert) {

        var
            model = new ProductionViewModel(),
            prev  = model.buyNum(),
            reVal = model.cmd("set");

        assert.equal(prev, model.buyNum(), "前后值比对通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"set\", data) => 传入 data 为 { buyNum: null }，this.buyNum 为原值", function(assert) {

        var
            model = new ProductionViewModel(),
            prev  = model.buyNum(),
            reVal = model.cmd("set");

        assert.equal(prev, model.buyNum(), "前后值比对通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"set\", data) => 传入 data 为 { buyNum: 3 }，this.buyNum 为 3", function(assert) {

        var
            model = new ProductionViewModel(),
            reVal = model.cmd("set", {buyNum: 3});

        assert.equal(model.buyNum(), 3, "前后值比对通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"get\") => 获取实例信息", function(assert) {

        var
            data    = Productions[0]
            model   = new ProductionViewModel(data),
            reVal   = model.cmd("get");

        assert.deepEqual(
            reVal.data,
            {
                name    : data.name,
                pic     : data.pic,
                prize   : data.prize,
                type    : data.type,
                sex     : data.sex,
                buyNum  : 0
            },
            "前后值比对通过"
        );
        assert.equal(reVal.status, 1, "状态值通过");
    });

})();


/**
 * PagesViewModel
 */

(function() {

    QUnit.module("Ⅳ PagesViewModel");

    QUnit.test("cmd(\"no exist cmd\") => 输入不存在的命令，返回错误状态", function(assert) {

        var
            Pages = PageViewModel,
            model = new PagesViewModel( {PageModel: PageViewModel} );

        assert.equal(model.cmd("no exist cmd").status, 0, "状态值通过");
    });

    QUnit.test("cmd(\"set\/newpages\") => 不传入参数，创建页码总数为 0 的列表", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages"),
            matchVal = 0;

        assert.ok(model.pageList() instanceof Array && model.pageList().length === matchVal, "前后值比对通过");
        assert.equal(reVal.status, 1, "状态值通过");
        assert.equal(reVal.data.length, matchVal, "返回值通过");
    });

    QUnit.test("cmd(\"set\/newpages\", data) => 传入 data 为 { total: 10 }，创建页码总数为 2 的列表", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 10}),
            matchVal = 2;

        assert.equal(matchVal, model.pageList().length, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
        assert.equal(reVal.data.length, matchVal, "返回值通过");
    });

    QUnit.test("cmd(\"set\/newpages\", data) => 传入 data 为 { total: 10, eachNum: 3 }，创建页码总数为 4 的列表", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 10, eachNum: 3}),
            matchVal = 4;

        assert.equal(matchVal, model.pageList().length, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
        assert.equal(reVal.data.length, matchVal, "返回值通过");
    });

    QUnit.test("cmd(\"set\/newpages\", data) => 传入 data 为 { total: '10', eachNum: null }，创建页码总数为 2 的列表", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: '10', eachNum: null}),
            matchVal = 2;

        assert.equal(matchVal, model.pageList().length, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
        assert.equal(reVal.data.length, matchVal, "返回值通过");
    });

    QUnit.test("cmd(\"show\/page\") => 不传入参数，获取当前页（第 1 页）的页码实例【先创建 5 页页码】", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 20, eachNum: 4}),
            reVal   = model.cmd("show/page");

        assert.equal(model.pageList()[0], reVal.data, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"show\/page\", data) => 传入 data 为 { page: 2 }，获取当前页（第 2 页）的页码实例【先创建 5 页页码】", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 20, eachNum: 4}),
            reVal   = model.cmd("show/page", {page: 2});

        assert.equal(model.pageList()[2], reVal.data, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"show\/page\", data) => 传入 data 为 { page: null }，获取当前页（第 1 页）的页码实例【先创建 5 页页码】", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 20, eachNum: 4}),
            reVal   = model.cmd("show/page", {page: null});

        assert.equal(model.pageList()[0], reVal.data, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"get\/curpage\") => 获取当前页（第 1 页）的页码数（即 0）【先创建 5 页页码】", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 20, eachNum: 4}),
            reVal   = model.cmd("get/curpage");

        assert.equal(0, reVal.data, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

    QUnit.test("cmd(\"get\/curpage\") => 获取当前页（第 3 页）的页码数（即 3）【先创建 5 页页码，翻到第 4 页】", function(assert) {

        var
            Pages   = PageViewModel,
            model   = new PagesViewModel( {PageModel: PageViewModel} ),
            reVal   = model.cmd("set/newpages", {total: 20, eachNum: 4}),
            reVal   = model.cmd("show/page", {page: 3}),
            reVal   = model.cmd("get/curpage");

        assert.equal(3, reVal.data, "值通过");
        assert.equal(reVal.status, 1, "状态值通过");
    });

})();
