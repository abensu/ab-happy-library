/**
 * 公式
 */
( function( root, factory ) {
    
    // 支持三种模块加载方式
    if ( typeof define === 'function' && define[ 'amd' ] ) {

        // [1] AMD 异步模块
        define( [ 'exports', 'require' ], factory );

    } else if ( typeof require === 'function' && typeof exports === 'object' && typeof module === 'object' ) {

        // [2] CommonJS/Node.js
        module[ 'exports' ] = factory();  // Node.js 的 module.exports

    } else {

        // [3] 无模块加载（纯 <script> 标签）- 直接将其放到全局变量中
        root[ 'GongShi' ] = factory();
    }

} ) ( this, function() {

    /**
     * 保留两位小数
     * 
     * @param {number} num 源数字
     * 
     * @returns {number} 保留两位后的数字
     */
    function f_b_liang_wei_xiao_shu ( num ) {

        return +num.toFixed( 2 );
    };

    /**
     * 等额本息
     *
     * @param {number} ben_jin  本金
     * @param {number} li_lv    年利率，单位为 %
     * @param {number} yue_shu  月份数
     *
     * @returns {Object} 范式为 { raw: number, more: number, period: number[], total: number }
     */
    function f_g_deng_e_ben_xi( ben_jin, li_lv, yue_shu ) {
        
        var
            d_yue_li_lv     = li_lv / 100 / 12,
            d_compute_data  = f_b_liang_wei_xiao_shu( ben_jin * d_yue_li_lv * Math.pow( ( 1 + d_yue_li_lv ), yue_shu ) / ( Math.pow( ( 1 + d_yue_li_lv ), yue_shu ) - 1 ) ),
            d_period_list   = [],
            d_total         = 0,
            d_total_li_xi   = 0;

        while ( d_period_list.length !== yue_shu ) {

            d_period_list.push( d_compute_data );
        }

        d_period_list.unshift( -ben_jin );

        d_total = f_b_liang_wei_xiao_shu( d_compute_data * yue_shu );

        d_total_li_xi = f_b_liang_wei_xiao_shu( d_total - ben_jin );

        return {
            total   : d_total,
            more    : d_total_li_xi,
            raw     : ben_jin,
            period  : d_period_list
        };
    };

    /**
     * 等额本金
     *
     * @param {number} ben_jin  本金
     * @param {number} li_lv    年利率，单位为 %
     * @param {number} yue_shu  月份数
     *
     * @returns {Object} 范式为 { raw: number, more: number, period: number[], total: number }
     */
    function f_g_deng_e_ben_jin( ben_jin, li_lv, yue_shu ) {

        var
            d_quan_bu_ben_jin   = ben_jin,
            d_mei_yue_ben_jin   = f_b_liang_wei_xiao_shu( d_quan_bu_ben_jin / yue_shu ),
            d_period_list       = [],
            d_yue_li_lv         = li_lv / 100 / 12,
            d_total             = 0,
            d_total_li_xi       = 0;

        while ( d_period_list.length !== yue_shu ) {

            var
                d_mei_yue_li_xi     = f_b_liang_wei_xiao_shu( d_quan_bu_ben_jin * d_yue_li_lv ),
                d_mei_yue_huan_kuan = f_b_liang_wei_xiao_shu( d_mei_yue_ben_jin + d_mei_yue_li_xi );

            d_period_list.push( d_mei_yue_huan_kuan );

            d_total += d_mei_yue_huan_kuan;

            d_quan_bu_ben_jin -= d_mei_yue_ben_jin;
        }

        d_period_list.unshift( -ben_jin );

        d_total = f_b_liang_wei_xiao_shu( d_total );

        d_total_li_xi = d_total - ben_jin;

        d_total_li_xi = f_b_liang_wei_xiao_shu( d_total_li_xi );

        return {
            total   : d_total,
            more    : d_total_li_xi,
            raw     : ben_jin,
            period  : d_period_list
        };
    };

    /**
     * 还本付息
     *
     * @param {number} ben_jin  本金
     * @param {number} li_lv    年利率，单位为 %
     * @param {number} yue_shu  月份数
     *
     * @returns {Object} 范式为 { raw: number, more: number, period: number[], total: number }
     */
    function f_g_huan_ben_fu_xi( ben_jin, li_lv, yue_shu ) {

        var
            d_yue_li_lv     = li_lv / 100 / 12,
            d_yue_li_xi     = f_b_liang_wei_xiao_shu( ben_jin * d_yue_li_lv ),
            d_period_list   = [],
            d_total_li_xi   = ben_jin * d_yue_li_lv * yue_shu;

        while ( d_period_list.length !== yue_shu ) {

            d_period_list.push( d_yue_li_xi );
        }

        d_period_list.unshift( -ben_jin );

        d_total_li_xi = f_b_liang_wei_xiao_shu( d_total_li_xi );

        d_period_list[ d_period_list.length - 1 ] = f_b_liang_wei_xiao_shu( ben_jin + d_total_li_xi - d_yue_li_xi * ( yue_shu - 1 ) );

        d_total = f_b_liang_wei_xiao_shu( ben_jin + d_total_li_xi );

        return {
            total   : d_total,
            more    : d_total_li_xi,
            raw     : ben_jin,
            period  : d_period_list
        };
    };

    /**
     * 零存整取
     *
     * @param {number} ben_jin  本金
     * @param {number} li_lv    年利率，单位为 %
     * @param {number} yue_shu  月份数
     *
     * @returns {Object} 范式为 { raw: number, more: number, period: number[], total: number }
     */
    function f_g_ling_cun_zheng_qu( ben_jin, li_lv, yue_shu ) {
        
        var
            d_period_list   = [],
            d_total_li_xi   = 0,
            d_yue_li_lv     = li_lv / 100 / 12,
            d_total         = 0;

        while ( d_period_list.length !== yue_shu ) {

            d_period_list.push( -ben_jin );
        }

        d_total_li_xi = f_b_liang_wei_xiao_shu( ( yue_shu + 1 ) / 2 * yue_shu * ben_jin * d_yue_li_lv );

        d_total = ben_jin * 12 + d_total_li_xi;

        d_period_list.push( d_total );

        return {
            total   : d_total,
            more    : d_total_li_xi,
            raw     : ben_jin,
            period  : d_period_list
        };
    };

    /**
     * 复利
     *
     * @param {number} ben_jin      本金
     * @param {number} li_lv        年利率，单位为 %
     * @param {number} shi_chang    时长，根据 type 判断单位
     * @param {string} type         类型，day：日复利计算，month：月复利计算，year：年复利计算
     *
     * @returns {Object} 范式为 { raw: number, more: number, period: number[], total: number }
     */
    function f_g_fu_li( ben_jin, li_lv, shi_chang, type ) {
        
        var
            d_total         = ben_jin
            d_total_li_xi   = 0,
            d_period_list   = [],
            d_each_li_lv    = li_lv / 100 / ( type === 'day' ? 360 : type === 'month' ? 12 : 1 );

        // 一月为 30 日
        // 一年为 360 日

        for ( var i = 0, len = shi_chang; i < len; i++ ) {

            var d_li_xi = f_b_liang_wei_xiao_shu( d_total * d_each_li_lv );

            d_total += d_li_xi;

            d_total = f_b_liang_wei_xiao_shu( d_total );

            d_total_li_xi += d_li_xi;

            d_total_li_xi = f_b_liang_wei_xiao_shu( d_total_li_xi );

            d_period_list.push( d_total_li_xi );
        }

        d_period_list.unshift( -ben_jin );

        return {
            total   : d_total,
            more    : d_total_li_xi,
            raw     : ben_jin,
            period  : d_period_list
        };
    };

    /**
     * 月月升
     *
     * @param {number} ben_jin          本金
     * @param {number} li_lv_lie_biao   年利率列表（当 yue_shu 大于此列表长度，大于的月份数以列表最后的利息计算），单位为 %
     * @param {number} yue_shu          月份数
     * @param {boolean} is_fu_li        是否是复利，true：复利版，每月基数为上月本息；false 或默认：无复利版，每月基数为本金
     *
     * @returns {Object} 范式为 { raw: number, more: number, period: number[], total: number }
     */
    function f_g_yue_yue_sheng( ben_jin, li_lv_lie_biao, yue_shu, is_fu_li ) {
        
        var
            d_total         = ben_jin
            d_total_li_xi   = 0,
            d_period_list   = [];

        for ( var i = 0, len = yue_shu; i < len; i++ ) {

            var
                d_each_percent  = li_lv_lie_biao[ i ] || li_lv_lie_biao[ li_lv_lie_biao.length - 1 ],
                d_base          = is_fu_li ? d_total : ben_jin,
                d_li_xi         = f_b_liang_wei_xiao_shu( d_base * d_each_percent / 100 / 12 );

            d_total += d_li_xi;

            d_total = f_b_liang_wei_xiao_shu( d_total );

            d_total_li_xi += d_li_xi;

            d_total_li_xi = f_b_liang_wei_xiao_shu( d_total_li_xi );

            d_period_list.push( d_total_li_xi );
        }

        d_period_list.unshift( -ben_jin );

        return {
            total   : d_total,
            more    : d_total_li_xi,
            raw     : ben_jin,
            period  : d_period_list
        };
    };
    
    // 暴露接口
    return {
        deng_e_ben_xi       : f_g_deng_e_ben_xi
        , deng_e_ben_jin    : f_g_deng_e_ben_jin
        , huan_ben_fu_xi    : f_g_huan_ben_fu_xi
        , ling_cun_zheng_qu : f_g_ling_cun_zheng_qu
        , fu_li             : f_g_fu_li
        , yue_yue_sheng     : f_g_yue_yue_sheng
    };
} );