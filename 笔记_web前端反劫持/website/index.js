let mod_restify     = require( 'restify' );
let mod_fs          = require( 'fs' );
let mod_path        = require( 'path' );
let mod_crypto      = require( 'crypto' );
let mod_querystring = require( 'querystring' );


// 服务器实例
let d_server = mod_restify.createServer();

// 设置主体数据编译（支持 json 格式的 body）
d_server.use( mod_restify.plugins.bodyParser() );

// 设置参数编译
d_server.use( mod_restify.plugins.queryParser() );

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
 * x-xss-protection 测试用例
 */

// [网页]
d_server.get( '/x-xss-protection', ( request, response ) => {
    
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );
    // response.setHeader( 'X-XSS-Protection', '0' );
    // response.setHeader( 'X-XSS-Protection', '1' );
    response.setHeader( 'X-XSS-Protection', '1; mode=block' );
    response.end( mod_fs.readFileSync( '0004-x-xss-protection/index.html', 'utf8' ) );
} );

// [资源]
d_server.get( '/x-xss-protection-static/base.js', ( request, response ) => {
    
    response.setHeader( 'Content-Type', 'application/javascript' );
    // response.setHeader( 'X-XSS-Protection', '0' );
    // response.setHeader( 'X-XSS-Protection', '1' );
    response.setHeader( 'X-XSS-Protection', '1; mode=block' );
    response.end( mod_fs.readFileSync( '0004-x-xss-protection/base.js', 'utf8' ) );
} );

// 请求 /x-xss-protection-static 作为静态文件目录指向 0004-x-xss-protection
// d_server.get( /^\/x-xss-protection-static\/?.*/, mod_restify.plugins.serveStatic( {
//     directory           : mod_path.resolve( __dirname, '0004-x-xss-protection' ),
//     appendRequestPath   : false,
//     default             : 'index.html',
// } ) );


/**
 * dom 测试用例
 */

// 请求 /dom 指向 0005-dom/index.html 文件
d_server.get( '/dom', mod_restify.plugins.serveStatic( {
    directory   : mod_path.resolve( __dirname, '0005-dom' ),
    file        : 'index.html',
} ) );

// 请求 /dom/static 作为静态文件目录指向 0005-dom
d_server.get( /^\/dom\/static\/?.*/, mod_restify.plugins.serveStatic( {
    directory           : mod_path.resolve( __dirname, '0005-dom' ),
    appendRequestPath   : false,
    default             : 'index.html',
} ) );

// 请求 /dom-report
d_server.post( '/dom-report', ( request, response ) => {

    response.setHeader( 'X-Hajack-Report', 'success' );
    response.end( '' );

    // 处理请求过来的数据
    console.log( request.body.time );
    console.log( request.body.from );
    console.log( request.body.content );
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
d_server.get( '/sri/sha256/file/:filename', ( request, response, next ) => {

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

// 获取指定字段的 base64 类型的 sha256 值
d_server.get( '/sri/sha256/text', ( request, response ) => {
    
    response.charSet( 'utf8' );

    if ( request.query.content ) {

        let d_sha = mod_crypto.createHash( 'sha256' );

        d_sha.update( request.query.content );

        response.send( {
            code    : 0,
            msg     : 'success',
            content : request.query.content,
            sha256  : d_sha.digest( 'base64' ),
        } );

    } else {

        response.send( {
            code    : 1,
            msg     : 'no text',
            content : '',
            sha256  : '',
        } );
    }
} );


/**
 * CSP 测试用例
 */

// 请求 /csp 指向 0003-csp/index.html 文件
d_server.get( '/csp', mod_restify.plugins.serveStatic( {
    directory   : mod_path.resolve( __dirname, '0003-csp' ),
    file        : 'index.html',
} ) );

// 请求以 /csp/ 开头的请求都跳到 /0003-csp/
d_server.get( /^\/csp\/.*/, ( request, response, next ) => {

    let d_path = request.getPath().replace( /^\/csp\//, '' );

    response.redirect( `/0003-csp/${d_path}`, next );
} );

// 请求 /0003-csp 作为静态文件目录
d_server.get( /^\/0003-csp\/?.*/, mod_restify.plugins.serveStatic( {
    directory   : mod_path.resolve( __dirname ),
    default     : 'index.html',
} ) );

// 请求 /csp-static 作为静态文件目录
d_server.get( /^\/csp-static\/?.*/, mod_restify.plugins.serveStatic( {
    directory   : mod_path.resolve( __dirname, '0003-csp' ),
    default     : 'index.html',
} ) );

// [接口]返回上报内容
d_server.post( '/csp-report', ( request, response ) => {

    let d_path = mod_path.resolve( __dirname, '0003-csp/case-report/report-from-post.txt' );

    let d_json = JSON.parse( request.body.toString() );

    mod_fs.appendFileSync( d_path, `// ${( new Date() ).toLocaleString()}\n` + JSON.stringify( d_json, null, 2 ) + '\n', 'utf8' );

    response.charSet( 'utf8' );

    response.send( request.body );
} );

// [网页]CSP 上报
d_server.get( '/csp-report-page/:type', ( request, response ) => {

    let d_type = request.params.type;
    
    response.setHeader( 'Cache-Control', 'public, max-age=3600' );
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );

    if ( d_type === 'report-and-block' ) {

        // 拦截并上报

        response.setHeader( 'Content-Security-Policy', `default-src 'self';report-uri /csp-report` );
        
    } else if ( d_type === 'report-no-block' ) {

        // 拦截不上报

        response.setHeader( 'Content-Security-Policy-Report-Only', `default-src 'self';report-uri /csp-report` );
    }

    response.end( mod_fs.readFileSync( mod_path.resolve( __dirname, '0003-csp/case-report/index.html' ), 'utf8' ) );
} );

// [网页]页面重置 CSP
d_server.get( '/csp-reset-csp-page/1', ( request, response ) => {
    
    response.setHeader( 'Cache-Control', 'public, max-age=3600' );
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );
    response.setHeader( 'Content-Security-Policy', `default-src 'self'` );

    response.end( mod_fs.readFileSync( mod_path.resolve( __dirname, '0003-csp/case-reset-csp/index.html' ), 'utf8' ) );
} );

// [网页]页面重置 CSP
d_server.get( '/csp-reset-csp-page/2', ( request, response ) => {
    
    response.setHeader( 'Cache-Control', 'public, max-age=3600' );
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );

    response.end( mod_fs.readFileSync( mod_path.resolve( __dirname, '0003-csp/case-reset-csp/index-2.html' ), 'utf8' ) );
} );


/**
 * CRLF 示例
 */
d_server.get( '/crlf', ( request, response ) => {
    
    response.setHeader( 'Cache-Control', 'public, max-age=3600' );
    response.setHeader( 'Content-Type', 'text/html; charset=utf-8' );

    response.end( mod_fs.readFileSync( mod_path.resolve( __dirname, '0101-crlf/index.html' ), 'utf8' ) );
} );

d_server.get( '/crlf/mock-search', ( request, response ) => {

    // console.log( request.query.keyword );

    response.send( 302, null, {
        // Location : '/crlf'
        Location : `/crlf?keyword=${request.query.keyword}` // 正常跳转且无注入
        // Location : '/crlf?url=%0d%0a%0d%0a<img src=1 onerror=alert(/xss/)>' // 正常跳转且无注入
        // Location : '/crlf?url=\\r\\n\\r\\n<img src=1 onerror=alert(/xss/)>' // 正常跳转且无注入
        // Location : `/crlf?url=\r\n<img src=1 onerror=alert(/xss/)>` // 服务器报 504 错误
    } );

    console.log( 'pass' );
} );