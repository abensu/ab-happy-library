/**
 * 实例化、绑定、初始化
 */

var
    appViewModel,
    searchViewModel,
    listViewModel,
    pagesViewModel,
    cartViewModel,
    storeViewModel;

// 实例-搜索区域
searchViewModel = new SearchViewModel();

// 实例-列表区域
listViewModel   = new ListViewModel();

// 实例-分页区域
pagesViewModel  = new PagesViewModel({
                        PageModel : PageViewModel
                    });

// 实例-购物车区域
cartViewModel   = new CartViewModel();

// 实例-缓存模型
storeViewModel  = new StoreViewModel({
                        ProductionModel : ProductionViewModel
                    });

// 实例-整体应用
appViewModel    = new AppViewModel({
                        Search  : searchViewModel,
                        List    : listViewModel,
                        Pages   : pagesViewModel,
                        Cart    : cartViewModel,
                        Store   : storeViewModel
                    });

// 绑定整体模型到 body 中
ko.applyBindings(appViewModel);

// 初始化
appViewModel.cmd("init", {dataList: Productions});

// 清除 loading 状态
document.body.classList.remove("mod_loading");