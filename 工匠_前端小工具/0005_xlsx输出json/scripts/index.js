// 参考 http://oss.sheetjs.com/


/**
 * 显示文件信息
 * 
 * @param {File} file 文件信息
 */
function g_f_showFileInfo ( file ) {

    document.getElementById( 'mod-file-info-show' ).textContent = file.name + " ( " + file.type + ", " + file.size + " bytes )";
};


/**
 * 显示文件信息
 * 
 * @param {Object} json JSON 对象
 */
function g_f_showRawJSON ( json ) {

    document.getElementById( 'mod-raw-json-field' ).textContent = JSON.stringify( json, null, 4 );
};


/**
 * 显示 HTML 结构
 * 
 * @param {Object} info HTML 字符串，范式为 { sheet_name : string }
 */
function g_f_showOutputTable ( info ) {

    var
        d_tmpl      = document.getElementById( 'tmpl-for-mod-output-table-field' ).innerHTML,
        f_compiled  = _.template( d_tmpl ),
        d_final     = f_compiled( { data : info } );

    document.getElementById( 'mod-output-table-field' ).innerHTML = d_final;
};


/**
 * 读取文件
 * 
 * @param {File} file           文件信息
 * @param {Function} callback   回调，范式为 ( error: Error | null, is_binary: boolean, file_data: binary | array ) => void
 */
function g_f_readFile ( file, callback ) {

    var n_reader = new FileReader();

    var d_can_use_readAsBinaryString = !!n_reader.readAsBinaryString; // true: readAsBinaryString ; false: readAsArrayBuffer

    n_reader.onload = function( evt ) {

        var data = evt.target.result;

        if ( !d_can_use_readAsBinaryString ) {

            data = new Uint8Array( data );
        }

        callback( null, d_can_use_readAsBinaryString, data );
    };

    if ( d_can_use_readAsBinaryString ) {

        n_reader.readAsBinaryString( file );

    } else {

        n_reader.readAsArrayBuffer( file );
    }
};


/**
 * 读取 xlsx 文件
 * 
 * @param {boolean} is_binary   是否是二进制字符串
 * @param {any} data            文件数据
 * 
 * @returns {Workbook} XLSX 插件的 Workbook 数据
 */
function g_f_xlsx_to_workbook ( is_binary, data ) {

    return XLSX.read( data, { type : is_binary ? 'binary' : 'array' } );
};


/**
 * Workbook 转 JSON
 * 
 * @param {Workbook} workbook XLSX 插件的 Workbook 数据
 * 
 * @returns {object} JSON 对象数据
 */
function g_f_workbook_to_json ( workbook ) {

    // workbook.SSF && XLSX.SSF.load_table( workbook.SSF );

    var result = {};

    workbook.SheetNames.forEach( function ( sheetName ) {

        var d_roa = XLSX.utils.sheet_to_json( workbook.Sheets[ sheetName ], { header : 1 } );

        if ( d_roa.length > 0 ) result[ sheetName ] = d_roa;
    } );

    return result;
};


/**
 * Workbook 转 html
 * 
 * @param {Workbook} workbook XLSX 插件的 Workbook 数据
 * 
 * @returns {string} html
 */
function g_f_workbook_to_html ( workbook ) {

    // workbook.SSF && XLSX.SSF.load_table( workbook.SSF );

    var result = {};

    workbook.SheetNames.forEach( function ( sheetName ) {

        var d_roa = XLSX.utils.sheet_to_html( workbook.Sheets[ sheetName ] );

        if ( d_roa ) result[ sheetName ] = d_roa.replace( /^[\s\S]*(<table>[\s\S]+<\/table>)[\s\S]*$/, '$1' );
    } );

    return result;
};


/**
 * 
 */
function g_f_loop_ajax () {

    $.getJSON(
        'http://5sing.kugou.com/subject/api/signup/getSingupInfoBySongId',
        {
            aid     : 'vMOFoqAuhEw=',
            songId  : '16242224'
        },
        function ( res) {
            
            console.log( res );
        }
    );
};


/**
 * input change
 */

function g_f_handleFile ( evt ) {

    var d_files = evt.target.files;

    if ( d_files ) {

        g_f_showFileInfo( d_files[ 0 ] );

        g_f_readFile( d_files[ 0 ], ( error, is_binary, data ) => {

            if ( error ) return !1;

            let d_workbook = g_f_xlsx_to_workbook( is_binary, data );

            let d_json = g_f_workbook_to_json( d_workbook );

            let d_info = g_f_workbook_to_html( d_workbook );

            g_f_showRawJSON( d_json );

            g_f_showOutputTable( d_info );
        } );
    }
}

document.getElementById( 'mod-file-field' ).addEventListener( 'change', g_f_handleFile, false );


/**
 * 拖放
 */

function g_f_handleDrag ( evt ) {

    evt.stopPropagation();
    evt.preventDefault();

    if ( evt.type == "drop" ) {

        let d_files = evt.dataTransfer.files;

        g_f_showFileInfo( d_files[ 0 ] );

        g_f_readFile( d_files[ 0 ], ( error, is_binary, data ) => {

            if ( error ) return !1;

            let d_workbook = g_f_xlsx_to_workbook( is_binary, data );

            let d_json = g_f_workbook_to_json( d_workbook );

            let d_info = g_f_workbook_to_html( d_workbook );

            g_f_showRawJSON( d_json );

            g_f_showOutputTable( d_info );
        } );
    }
}

// document.getElementById( 'my-drag' ).addEventListener( 'dragenter', g_f_handleDrag, false );
// document.getElementById( 'my-drag' ).addEventListener( 'dragover', g_f_handleDrag, false );
document.getElementById( 'mod-file-field' ).addEventListener( 'drop', g_f_handleDrag, false );