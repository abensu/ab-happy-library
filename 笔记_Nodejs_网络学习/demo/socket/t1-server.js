const http = require('http');
let crypto = require( 'crypto' );

// Create an HTTP server
const srv = http.createServer( ( req, res ) => {

  console.log( req.url );

  res.writeHead( 200, { 'Content-Type' : 'text/plain' } );
  res.end( 'okay' );
} );

srv.on( 'upgrade', ( req, socket, head ) => {

  let d_client_key = req.headers[ 'sec-websocket-key' ];

  let d_public_mash = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

  let d_sha = crypto.createHash( 'sha1' );

  d_sha.update( d_client_key + d_public_mash );

  let d_ws_accept = d_sha.digest( 'base64' );

  console.log( 'client key:', d_client_key );
  console.log( 'server key:', d_ws_accept );

  socket.write(
    'HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
    'Upgrade: WebSocket\r\n' +
    'Connection: Upgrade\r\n' +
    'Sec-WebSocket-Accept: ' + d_ws_accept + '\r\n' +
    '\r\n'
  );

  // socket.pipe( socket ); // echo back

  socket.on( 'data', ( data ) => {

    // console.log( 'client say:', parse_msg( data ).toString( 'utf8' ) );
    console.log( 'client say:', decodeDataFrame( data ).PayloadData );

    // socket.write( build_msg( 'hello world' ) );
    socket.write( encodeDataFrame( { PayloadData : 'hello world', FIN : 0, Opcode : 1 } ) );
  } );
} );

// now that server is running
srv.listen( 1337, () => {

  console.log( '服务器开启' );
} );

/**
 * 打包数据，实际上payload_len == 127时的打包方法是有待商榷的，这里先这样简单实现
 */
function parse_msg(data){
	data = data || null;
	if( ( data.length <= 0 ) || ( !Buffer.isBuffer(data) ) ){
		return null;
	}
 
	var mask_flag = (data[1] & 0x80 == 0x80) ? 1 : 0;//All frames sent from client to server have this bit set to 1.
	var payload_len = data[1] & 0x7F;//0111 1111
 
	if( payload_len == 126 ){
		masks = data.slice(4,8);
		payload_data = data.slice(8);
		payload_len = data.readUInt16BE(2);
	}else if( payload_len == 127 ){
		masks = data.slice(10,14);
		payload_data = data.slice(14);
		payload_len = data.readUInt32BE(2) * Math.pow(2,32) + data.readUInt32BE(6);
	}else{
		masks = data.slice(2,6);
		payload_data = data.slice(6);
	}
	//console.log(payload_len);
	//console.log(payload_data.length);
	for( var i=0;i< payload_len;i++ ){
		payload_data[i]= payload_data[i] ^ masks[i%4];
	}
 
	return payload_data;
}

/**
 * 很简陋的实现打包，并且不支持mask，不支持其他命令，不支持拆包、装包、不支持大于16位长度的数据……
 */
function build_msg( str_msg, mask ){
	str_msg = str_msg || "";
	mask = mask || false;
 
	var msg_len = Buffer.byteLength(str_msg,"utf-8"), packed_data;
	if( msg_len <= 0 ){
		return null;
	}
 
	if( msg_len < 126 ){
		packed_data = new Buffer(2+msg_len);
		packed_data[0] = 0x81;
		packed_data[1] = msg_len;
		packed_data.write( str_msg, 2 );
	}else if( msg_len <= 0xFFFF ){//用16位表示数据长度
		packed_data = new Buffer(4 + msg_len);
		packed_data[0] = 0x81;
		packed_data[1] = 126;
		packed_data.writeUInt16BE( msg_len, 2 );
		packed_data.write( str_msg, 4 );
	}else{//用64位表示数据长度
		/*packed_data = new Buffer(10+msg_len);
		packed_data[0] = 0x81;
		packed_data[1] = 127;
		packed_data.writeUInt32BE(msg_len & 0xFFFF0000 >> 32, 2);
		packed_data.writeUInt32BE(msg_len & 0xFFFF, 6);
		packed_data.write( str_msg, 10 );*/
	}
 
	return packed_data;
}

// 数据帧的解析
function decodeDataFrame(e){
  var i=0,j,s,frame={
    //解析前两个字节的基本数据
    FIN:e[i]>>7,Opcode:e[i++]&15,Mask:e[i]>>7,
    PayloadLength:e[i++]&0x7F
  };
  //处理特殊长度126和127
  if(frame.PayloadLength==126)
    frame.length=(e[i++]<<8)+e[i++];
  if(frame.PayloadLength==127)
    i+=4, //长度一般用四字节的整型，前四个字节通常为长整形留空的
    frame.length=(e[i++]<<24)+(e[i++]<<16)+(e[i++]<<8)+e[i++];
  //判断是否使用掩码
  if(frame.Mask){
    //获取掩码实体
    frame.MaskingKey=[e[i++],e[i++],e[i++],e[i++]];
    //对数据和掩码做异或运算
    for(j=0,s=[];j<frame.PayloadLength;j++)
      s.push(e[i+j]^frame.MaskingKey[j%4]);
  }else s=e.slice(i,frame.PayloadLength); //否则直接使用数据
  //数组转换成缓冲区来使用
  s=new Buffer(s);
  //如果有必要则把缓冲区转换成字符串来使用
  if(frame.Opcode==1)s=s.toString();
  //设置上数据部分
  frame.PayloadData=s;
  //返回数据帧
  return frame;
}

// 数据帧的编码
function encodeDataFrame(e){
  var s=[],o=new Buffer(e.PayloadData),l=o.length;
  //输入第一个字节
  s.push((e.FIN<<7)+e.Opcode);
  //输入第二个字节，判断它的长度并放入相应的后续长度消息
  //永远不使用掩码
  if(l<126)s.push(l);
  else if(l<0x10000)s.push(126,(l&0xFF00)>>2,l&0xFF);
  else s.push(
    127, 0,0,0,0, //8字节数据，前4字节一般没用留空
    (l&0xFF000000)>>6,(l&0xFF0000)>>4,(l&0xFF00)>>2,l&0xFF
  );
  //返回头部分和数据部分的合并缓冲区
  return Buffer.concat([new Buffer(s),o]);
}