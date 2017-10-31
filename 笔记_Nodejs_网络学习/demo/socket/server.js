let mod_net = require( 'net' );

let d_server = mod_net.createServer();

d_server.on( 'connection', ( client ) => {
  
  console.info( `new client joins in : remoteAddress [${client.remoteAddress}], and remotePort [${client.remotePort}]` );

  client.on( 'data', ( data ) => {
    
      console.log( `[${client.remotePort}] say : ${data.toString()}` );

      client.write( 'get your message' ); // 发信息给客户端
  } );

} );

d_server.listen( 41000, () => {

  let d_address = d_server.address();

  console.log( `socket server is ${d_address.address}:${d_address.port}` );
} );