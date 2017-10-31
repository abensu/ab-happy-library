let mod_net = require( 'net' );

let d_client = mod_net.connect( { port : 41000 }, () => {

  console.log( 'client connect server successfully' );

  d_client.setEncoding( 'utf8' );

  d_client.write( 'Hello Server' ); // 发信息给服务端
} );

d_client.on( 'data', ( data ) => {

  console.log( '[server] say :', data );
} );

d_client.on( 'error', ( error ) => {
  
  console.log( '[server] error :', error.message );
} );