let mod_dgram = require( 'dgram' );

let d_client = mod_dgram.createSocket( 'udp4' );

d_client.on( 'listening', () => {

  // 可以在这里看出被随机分配的端口

  let d_address = d_client.address();
  
  console.info( `+++ client is listening to ${d_address.address}:${d_address.port}` );

} );

d_client.send( 'hi server', 41234, '127.0.0.1' );

d_client.on( 'message', ( msg, info ) => {

  // info 的事例为 { address: '127.0.0.1', family: 'IPv4', port: 41234, size: 26 }

  console.info( `*** get message : ${msg} from ${info.address}:${info.port}` );

  console.info( 'client know server has got the message' );

} );