/**
 * 劫持处理对象
 * 
 * @description
 *  默认情况下，当前域名是安全的，检测的元素首先要都是当前域的资源
 */
var HJD = ( function( white_list_config, defense_level, doc, win, undefined ) {

    /** 各 host 对应的白名单列表 */
    var d_g_white_list_config = white_list_config;

    /** 防御级别 */
    var d_g_defense_level = defense_level;

    /** 当前页面的 host 值 */
    var d_g_cur_host = location.host;

    /** 当前白名单列表 */
    var d_g_white_list = d_g_cur_host in d_g_white_list_config ? [ d_g_cur_host ].concat( d_g_white_list_config[ d_g_cur_host ] ) : [ d_g_cur_host ];

    /**
     * 获取地址的 host，即 'http://127.0.0.1:8903/dom' 得到 '127.0.0.1:8903'
     * 
     * @param {string} url 目标地址
     * 
     * @returns {string} host 值，默认为 ''
     */
    function f_g_get_host ( url ) {

        var d_match = url.match( /http[s]*:\/\/([^\/]+)/ );

        return d_match ? d_match[ 1 ] : '';
    };

    /**
     * 检测某个元素是否在列表中
     * 
     * @param {any}     ele     要检测的元素
     * @param {any[]}   list    验证的列表
     * 
     * @returns {boolean} 是否存在
     */
    var f_g_check_in_list = ( function() {
        
        if ( typeof Array.prototype.indexOf === 'function' ) {

            return function( ele, list ) {

                return list.indexOf( ele ) >= 0;
            };

        } else {

            return function( ele, list ) {

                for ( var i = list.length; i--; ) {
                    
                    if ( list[ i ] === ele ) {
    
                        return true;
                    }
                }
    
                return false;
            };
        }

    } )();

    /**
     * 页面快照并判断是否有第三方（非白名单）链接
     * 
     * @returns {boolean} 是否有第三方（非白名单）链接
     */
    function f_g_screenshot_and_whether_have_3rd_url () {

        var d_screenshot = document.documentElement.outerHTML;

        var d_match = d_screenshot.match( /http[s]*:\/\/[^)'"\s]+/g );

        if ( d_match ) {

            for ( var i = d_match.length; i--; ) {

                if ( !f_g_check_in_list( f_g_get_host( d_match[ i ] ), d_g_white_list ) ) {

                    return true;
                }
            }
        }
        
        return false;
    };
    
    /**
     * 元素地址信息类
     * 
     * @param {HTMLElement} node    html 元素
     * @param {string}      url     地址
     * 
     * @constructor
     * @prop {string} tagName       标签名
     * @prop {string} from_prop     地址的来源属性
     * @prop {string} url           地址
     * @prop {string} host          地址 host
     */
    function M_NodeUrlInfo ( node, url, from_prop ) {
        this.tagName    = node.tagName.toLocaleLowerCase();
        this.from_prop  = from_prop;
        this.url        = url;
        this.host       = f_g_get_host( url );
    };

    /**
     * 元素与元素地址信息类
     * 
     * @param {HTMLElement}     node            html 元素
     * @param {M_NodeUrlInfo[]} nodeUrlInfos    元素地址信息列表
     * 
     * @constructor
     * @prop {HTMLElement}      node            html 元素
     * @prop {M_NodeUrlInfo[]}  nodeUrlInfos    元素地址信息列表
     */
    function M_NodeAndNodeUrlInfos ( node, nodeUrlInfos ) {
        this.node           = node;
        this.nodeUrlInfos   = nodeUrlInfos;
    };

    /**
     * 根据元素上的链接，获取元素地址信息实例列表
     * 
     * @param {HTMLElement} node            html 元素
     * @param {boolean}     includeStyle    是否要涉及到样式中会有相关图片路径的属性
     * 
     * @returns {M_NodeUrlInfo[]} 默认返回 []
     */
    function f_g_get_ele_nuis ( node, includeStyle ) {

        var
            n_tar       = node,
            d_host      = '',
            d_tag_name  = n_tar instanceof HTMLElement ? n_tar.tagName.toLocaleLowerCase() : '',
            d_res_nuis  = [];

        switch ( d_tag_name ) {
            
            // 来源属性为 src
            case 'frame'    :
            case 'iframe'   :
            case 'img'      :
            case 'video'    :
            case 'audio'    :
            case 'source'   :
            case 'embed'    :
            case 'script'   :
                ( d_host = f_g_get_host( n_tar.src ) )
                    && ( d_host !== d_g_cur_host )
                    && d_res_nuis.push( new M_NodeUrlInfo( n_tar, n_tar.src, 'src' ) );
                break;

            // 来源属性为 href
            case 'link' :
            case 'a'    :
            case 'area' :
            case 'base' :
                ( d_host = f_g_get_host( n_tar.href ) )
                    && ( d_host !== d_g_cur_host )
                    && d_res_nuis.push( new M_NodeUrlInfo( n_tar, n_tar.href, 'href' ) );
                break;

            // 来源属性为 data
            case 'object' :
                ( d_host = f_g_get_host( n_tar.data ) )
                    && ( d_host !== d_g_cur_host )
                    && d_res_nuis.push( new M_NodeUrlInfo( n_tar, n_tar.data, 'data' ) );
                break;

            // 来源属性为 action
            case 'form' :
                ( d_host = f_g_get_host( n_tar.action ) )
                    && ( d_host !== d_g_cur_host )
                    && d_res_nuis.push( new M_NodeUrlInfo( n_tar, n_tar.action, 'action' ) );
                break;
            
            // 来源属性为 value
            case 'param' :
                n_tar.name === 'src'
                    && ( d_host = f_g_get_host( n_tar.value ) )
                    && ( d_host !== d_g_cur_host )
                    && d_res_nuis.push( new M_NodeUrlInfo( n_tar, n_tar.value, 'value' ) );
                break;
            
            // 来源属性为其内容
            case 'style' :

                var
                    d_style_con     = n_tar.textContent,
                    d_style_match   = d_style_con.match( /http[s]*:\/\/[^)'"\s]+/g ),
                    d_match_urls    = d_style_match || [];
                
                for ( var i = d_match_urls.length; i--; ) {

                    var d_each_url = d_match_urls[ i ];

                    d_host = f_g_get_host( d_each_url );

                    if ( d_host && d_host !== d_g_cur_host ) {

                        d_res_nuis.push( new M_NodeUrlInfo( n_tar, d_each_url, 'style' ) );

                        break;
                    }
                }
                break;
        }

        if ( includeStyle ) {

            // 检测涉及到图片路径的样式属性

            var
                d_r_url_box         = /(^url\(['"]*)|(['"]*\)$)/g,
                d_tar_css           = n_tar.currentStyle || win.getComputedStyle( n_tar, null ),
                d_tar_css_bg_img    = d_tar_css.backgroundImage.replace( d_r_url_box, '' ),
                d_tar_css_li_img    = d_tar_css.listStyleImage.replace( d_r_url_box, '' );

            ( d_host = f_g_get_host( d_tar_css_bg_img ) )
                && ( d_host !== d_g_cur_host )
                && d_res_nuis.push( new M_NodeUrlInfo( n_tar, d_tar_css_bg_img, 'style' ) );

            ( d_host = f_g_get_host( d_tar_css_li_img ) )
                && ( d_host !== d_g_cur_host )
                && d_res_nuis.push( new M_NodeUrlInfo( n_tar, d_tar_css_li_img, 'style' ) );
        }

        return d_res_nuis;
    };

    /**
     * 检测列表组是否都在白名单 host 中
     * 
     * @param {M_NodeUrlInfo[]} nodeUrlInfo_list    要检测的地址列表
     * @param {string[]}        white_list_host     白名单地址列表
     * 
     * @param {M_NodeUrlInfo[]} 默认返回 []。如果 nodeUrlInfo_list 为空，white_list_host 不为空，返回 []；如果 nodeUrlInfo_list 不为空，white_list_host 为空，返回 []。
     */
    function f_g_check_nodeUrlInfos_in_white_list_host ( nodeUrlInfo_list, white_list_host ) {

        if ( !nodeUrlInfo_list || !nodeUrlInfo_list.length || !white_list_host || !white_list_host.length ) {

            return [];
        }

        var d_res_nuis = [];

        for ( var i = nodeUrlInfo_list.length; i --; ) {

            var d_nuis_each = nodeUrlInfo_list[ i ];

            if ( !f_g_check_in_list( d_nuis_each.host, white_list_host ) ) {

                d_res_nuis.push( d_nuis_each );
            }
        }

        return d_res_nuis;
    };

    /**
     * 检测某类标签，返回没有通过的元素与元素地址信息集合
     * 
     * @param {string} tag_name 某类元素的标签名
     * 
     * @returns {M_NodeAndNodeUrlInfos[]} 元素与元素地址信息集合
     */
    function f_g_check_nodes_and_get_no_pass_nodes ( tag_name ) {

        var
            n_tar_list          = doc.querySelectorAll( tag_name ),
            n_no_pass_nanuis    = [];

        for ( var i = n_tar_list.length; i--; ) {
    
            var
                n_tar       = n_tar_list[ i ],
                d_nuis      = f_g_get_ele_nuis( n_tar, true ),
                d_back_nuis = f_g_check_nodeUrlInfos_in_white_list_host( d_nuis, d_g_white_list );

            d_back_nuis.length && n_no_pass_nanuis.push( new M_NodeAndNodeUrlInfos( n_tar, d_back_nuis ) );
        }

        return n_no_pass_nanuis;
    };

    /**
     * 上报元素与元素地址信息集合中的元素（整合信息，上传到 /dom-report，数据结构随便想的，应与后端进一步确定）
     * 
     * @param {M_NodeAndNodeUrlInfos[]} nanuis 要上报的标签列表
     */
    function f_g_report_nodeAndNodeUrlInfos ( nanuis ) {

        var d_report_list = []; // [ 'iframe:src=http://localhost:8903/xxoo', ... ]

        for ( var i = nanuis.length; i--; ) {

            var d_nuis = nanuis[ i ].nodeUrlInfos;

            for ( var n = d_nuis.length; n--; ) {

                var d_nui = d_nuis[ n ];

                d_report_list.push( d_nui.tagName + ':' + d_nui.from_prop + '=' + d_nui.url );
            }
        }

        var d_content = d_report_list.join( '|' );

        var d_from = location.href;

        var d_time = +new Date();

        var d_box_innerHtml = [
            '<iframe name="hajack_report"></iframe>'
            , '<form action="http://localhost:8903/dom-report" target="hajack_report" method="post">'
            , '<input name="from" value="' + d_from + '" />'
            , '<input name="time" value="' + d_time + '" />'
            , '<input name="content" value="' + d_content + '" />'
            , '</form>'
        ].join( '' );

        var n_box = doc.createElement( 'div' );

        n_box.style.display = 'none';

        n_box.innerHTML = d_box_innerHtml;

        doc.body.appendChild( n_box );

        n_box.getElementsByTagName( 'form' )[ 0 ].submit();

        n_box.getElementsByTagName( 'iframe' )[ 0 ].onload = function() {

            n_box.getElementsByTagName( 'iframe' )[ 0 ].src = 'about:blank';

            n_box.parentNode.removeChild( n_box );
        };
    };

    /**
     * 释放（清除）元素与元素地址信息集合中的元素（参数 nanuis 也会清零）
     * 
     * @param {M_NodeAndNodeUrlInfos[]} nanuis 要释放（清除）的标签列表
     */
    function f_g_release_nodeAndNodeUrlInfos ( nanuis ) {

        while ( nanuis.length ) {

            var
                d_nanui         = nanuis.shift(),
                n_tar           = d_nanui.node,
                n_tar_parent    = n_tar.parentNode,
                d_tag_name      = n_tar.tagName.toLocaleLowerCase();
            
            // 对某些元素释放（清除）前要做处理
            switch ( d_tag_name ) {

                case 'frame'    :
                case 'iframe'   :
                    n_tar.src = 'about:blank';
                    break;

                case 'video'    :
                case 'audio'    :
                    n_tar.pause();
                    break;
                
                case 'param'    :
                case 'source'   :
                    n_tar = n_tar_parent;
                    n_tar_parent = n_tar_parent.parentNode;
                    break;
                
                case 'html'     :
                case 'body'     :
                case 'head'     :
                    return false;
            }

            n_tar_parent && n_tar_parent.removeChild( n_tar );

            d_nanui.node = undefined; // 释放索引
        }
    };

    /**
     * 检测所有元素，并处理没有通过检测的元素（其实这是一个总入口函数）
     */
    function f_g_check_all_and_deal_with_no_pass_nodes () {

        var d_g_bad_all = f_g_check_nodes_and_get_no_pass_nodes( '*' );
        
        f_g_report_nodeAndNodeUrlInfos( d_g_bad_all );

        d_g_defense_level === 'strict' && f_g_release_nodeAndNodeUrlInfos( d_g_bad_all );
    };

    /**
     * 不要一开始就检测，等 load 完页面 1 秒后，UI 出来了，再进行检测与处理
     */
    setTimeout( function() {

        f_g_screenshot_and_whether_have_3rd_url() && f_g_check_all_and_deal_with_no_pass_nodes();

    }, 1000 );

} )
(
    // 各 host 对应的白名单列表
    {
        // '127.0.0.1:8903' : [ 'localhost:8903' ]
    }
    // 防御级别，"strict"：上报并删除元素，默认 "report"：仅上报
    , 'strict'
    // 下面为其他外部变量
    , document
    , window
);