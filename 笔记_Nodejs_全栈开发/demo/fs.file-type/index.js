let mod_fs = require( 'fs' );

// 其他根盘的 fs.States
mod_fs.stat( 'C:\\', ( err, stats ) => {

    console.log( '==========' );
    console.log( 'path : ', 'C:\\' );
    console.log( stats );
} );

// 当前目录的 fs.States
mod_fs.stat( './', ( err, stats ) => {
    
    console.log( '==========' );
    console.log( 'path : ', './' );
    console.log( stats );
} );

// 当前目录下各文件的 fs.States
mod_fs.readdir( './', ( err, files ) => {

    files.forEach( ( fname ) => {

        mod_fs.stat( fname, ( err, stats ) => {
            
            console.log( '==========' );
            console.log( 'path : ', fname );
            console.log( stats );
        } );
    } );
} );