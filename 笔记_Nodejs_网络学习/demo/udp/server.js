let mod_dgram = require( 'dgram' );

let d_server = mod_dgram.createSocket( 'udp4' );

d_server.on( 'listening', () => {

  let d_address = d_server.address();
  
  console.info( `+++ server is listening to ${d_address.address}:${d_address.port}` );

} );

d_server.on( 'message', ( msg, info ) => {

  console.info( `*** get message : ${msg} from ${info.address}:${info.port}` );

  d_server.send( 'I got message! from server', info.port, info.address );

} );

d_server.bind( 41234 );