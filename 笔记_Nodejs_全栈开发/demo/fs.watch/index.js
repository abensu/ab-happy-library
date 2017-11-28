let mod_fs = require( 'fs' );

let d_files_watch = mod_fs.watch( './' );

d_files_watch.addListener( 'change', ( eventType, filename ) => {
    
    console.log( `file change[${eventType}] : ${filename}` );
} );

d_files_watch.addListener( 'error', ( err ) => {
    
    console.log( `file error : ${err}` );
} );