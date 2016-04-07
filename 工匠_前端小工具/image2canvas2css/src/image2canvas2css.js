/**
 * 通过 canvas 获得图片信息，并输出成 css
 *
 * @prop {function} convert : [ ( data ) ] 将指定图片，根据参数，生成样式表
 *  |
 *  `- @param {object} data : [ {} ] 参数对象
 *      |
 *      |- @prop {string} url   : [] 图片的路径
 *      |- @prop {array} opts   : [] 图片精灵参数
 *      |   |
 *      |   `- @each {object} : 参数对戏
 *      |       |
 *      |       |- @prop {string} name  : [] 样式名（如 "body" ".cj_ban_jihuo"）
 *      |       `- @prop {array} clst   : [] 样式参数列表
 *      |           |
 *      |           `- @each {object} : 参数对戏
 *      |               |
 *      |               |- @prop {string} type  : [] 样式明，含 "image" 的（如 "background-image"），会进行图片处理，否则进行取色处理
 *      |               |- @prop {number} x     : [] 横向定位
 *      |               |- @prop {number} y     : [] 纵向定位
 *      |               |- @prop {number} w     : [] 元素宽度
 *      |               `- @prop {number} h     : [] 元素高度
 *      |
 *      `- @prop {function} callback : [ ( data ) ] 回调函数
 *          |
 *          `- @param {object} data : [] 返回的样式数据
 *              |
 *              |- @prop {string} styleCon          : [ '' ] 全部的样式内容
 *              `- @prop {string} <opts[n].name>    : [ '' ] 样式名
 */

var image2canvas2css = ( function() {

    var
        n_doc       = document,
        n_body      = n_doc.body,
        func_convert;

    func_convert = function( data ) {

        var
            d_data      = data || {},
            d_url       = d_data.url,
            d_cb        = d_data.callback,
            d_opts      = d_data.opts,
            n_canvas    = n_doc.createElement( "canvas" ),
            n_cxt       = n_canvas.getContext( "2d" ),
            n_img       = new Image();

        n_img.src = d_url;

        n_img.addEventListener( "load", function() {

            var
                d_w     = n_img.width,
                d_h     = n_img.height,
                d_res   = {};

            n_canvas.width = d_w;
            n_canvas.height = d_h;

            n_cxt.drawImage( n_img, 0, 0, d_w, d_h );

            d_res.styleCon = '';

            for ( var i = 0; i < d_opts.length; i++ ) {

                var d_each_cell = d_opts[ i ];

                d_res.styleCon += d_each_cell.name + "{";

                for ( var n = 0; n < d_each_cell.clst.length; n++ ) {

                    var
                        d_each_cell_each_css            = d_each_cell.clst[ n ],
                        d_each_cell_each_css_styleName  = d_each_cell_each_css.type;

                    if ( /image/i.test( d_each_cell_each_css_styleName ) ) {

                        // 图片处理

                        var
                            d_raw_img       = n_cxt.getImageData( d_each_cell_each_css.x, d_each_cell_each_css.y, d_each_cell_each_css.w, d_each_cell_each_css.h ),
                            d_res_img       = '',
                            d_oth_canvas    = n_doc.createElement("canvas"),
                            d_oth_cxt       = d_oth_canvas.getContext("2d");

                        d_oth_canvas.width = d_each_cell_each_css.w;
                        d_oth_canvas.height = d_each_cell_each_css.h;

                        d_oth_cxt.putImageData( d_raw_img, 0, 0 );

                        d_res_img = "url(" + d_oth_canvas.toDataURL() + ")";

                        d_res[ d_each_cell.name ] = d_res_img;

                        d_res.styleCon += d_each_cell_each_css_styleName + ":" + d_res_img + ";";

                    } else {

                        // 取色处理

                        var
                            d_raw_color = n_cxt.getImageData( d_each_cell_each_css.x, d_each_cell_each_css.y, 1, 1 ).data,
                            d_res_color = "rgb(" + d_raw_color[ 0 ] + "," + d_raw_color[ 1 ] + "," + d_raw_color[ 2 ] + ")";

                        d_res[ d_each_cell.name ] = d_res_color;

                        d_res.styleCon += d_each_cell_each_css_styleName + ":" + d_res_color + ";";
                    }
                }

                d_res.styleCon += "}";
            }

            typeof d_cb === "function" && d_cb( d_res );

        }, false );
    };

    return {
        convert : func_convert
    };

} )();
