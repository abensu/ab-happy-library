let mod_restify = require( 'restify' );
let mod_fs      = require( 'fs' );
let mod_path    = require( 'path' );
let mod_crypto  = require( 'crypto' );


// 服务器实例
let d_server = mod_restify.createServer();

// 设置 Gzip
d_server.use( mod_restify.plugins.gzipResponse() );

// 端口监听
d_server.listen( 8903, () => {
    
    console.log( '%s listening at %s', d_server.name, d_server.url );
} );


/**
 * x-frame-options 测试用例
 */

// 父页面
d_server.get( '/x-frame-options', ( request, response ) => {
    
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );
    response.end( mod_fs.readFileSync( '0001-x-frame-options/index.html', 'utf8' ) );
} );

// 子页面
d_server.get( '/x-frame-options/child', ( request, response ) => {
    
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );

    // response.setHeader( 'X-Frame-Options', 'DENY' ); // 不允许在任何来源的父页面上，在 frame 中展示
    // response.setHeader( 'X-Frame-Options', 'SAMEORIGIN' ); // 允许在同源的父页面上，在 frame 中展示
    // response.setHeader( 'X-Frame-Options', 'ALLOW-FROM' ); // 等同于 DENY
    // response.setHeader( 'X-Frame-Options', 'ALLOW-FROM http://127.0.0.1:8903' ); // 等同于 SAMEORIGIN
    response.setHeader( 'X-Frame-Options', 'ALLOW-FROM http://kugou.com' ); // 只能展示在酷狗的父域中
    // response.setHeader( 'X-Frame-Options', 'ERROR' ); // 设置无效值，等于没设

    response.end( mod_fs.readFileSync( '0001-x-frame-options/child.html', 'utf8' ) );
} );


/**
 * SRI 测试用例
 */

// 请求 /sri 指向 0002-sri/index.html 文件
d_server.get( '/sri', mod_restify.plugins.serveStatic( {
    directory   : mod_path.resolve( __dirname, '0002-sri' ),
    file        : 'index.html',
} ) );

// 请求 /sri/static 作为静态文件目录指向 0002-sri
d_server.get( /^\/sri\/static\/?.*/, mod_restify.plugins.serveStatic( {
    directory           : mod_path.resolve( __dirname, '0002-sri' ),
    appendRequestPath   : false,
    default             : 'index.html',
} ) );

// 获取 0002-sri 文件夹中某文件的 base64 类型的 sha256 值
d_server.get( '/sri/sha256/:filename', ( request, response, next ) => {

    let d_file_path = mod_path.resolve( __dirname, '0002-sri', request.params.filename );

    response.charSet( 'utf8' );

    if ( mod_fs.existsSync( d_file_path ) ) {

        let d_sha = mod_crypto.createHash( 'sha256' );

        let d_file_stream = mod_fs.createReadStream( d_file_path );

        d_file_stream.on( 'data', ( data ) => {
            
            d_sha.update( data );
        } );

        d_file_stream.on( 'end', function() {

            response.send( d_sha.digest( 'base64' ) );
        } );

    } else {

        response.send( 'no file' );
    }

    next();
} );