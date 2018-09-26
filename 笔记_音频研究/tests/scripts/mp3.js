/**
 * MP3 对象
 */
class MP3 {

    constructor () {

        /** 错误代码 */
        this.CODE = {

            /** 格式错误[E001]\n> 请输入四位十六进制的数据\n> 例如 “FF FB 90 00” 或 “FFFB9000” */
            E001 : '格式错误[E001]\n> 请输入四位十六进制的数据\n> 例如 “FF FB 90 00” 或 “FFFB9000”',

            /** 格式错误[E002]\n> 请输入十位十六进制的数据\n> 例如 如“49 44 33 03 00 00 00 00 01 25”或“49443303000000000125” */
            E002 : '格式错误[E002]\n> 请输入十位十六进制的数据\n> 例如 如“49 44 33 03 00 00 00 00 01 25”或“49443303000000000125”',

            /** 数据错误[E003]\n> 不含 “ID3” */
            E003 : '格式错误[E003]\n> 不含 “ID3”',
        };
    };

    /**
     * 计算 ID3V2 头数据
     * 
     * @params {string} buf_str 十六进制的字符串
     * 
     * @returns {Error|Object} 返回错误信息或 json 数据
     */
    compute_ID3V2_header ( buf_str ) {

        let d_is_match = /^[0-9a-fA-F]{20}$/.test( buf_str );

        if ( !d_is_match ) return new Error( this.CODE.E002 );

        let
            d_16 = parseInt( buf_str, 16 ),
            d_json = {
                id3         : false,
                version     : 0,
                revision    : 0,
                Unsynchronisation : false,
                extension   : false,
                test        : false,
                size        : 0,
            };

        d_json.id3 = String.fromCharCode( parseInt( buf_str.slice( 0, 2 ), 16 ) ) === 'I'
                        && String.fromCharCode( parseInt( buf_str.slice( 2, 4 ), 16 ) ) === 'D'
                        && String.fromCharCode( parseInt( buf_str.slice( 4, 6 ), 16 ) ) === '3'
                        ;

        if ( !d_json.id3 ) return new Error( this.CODE.E003 );

        d_json.version = parseInt( buf_str.slice( 6, 8 ), 16 );

        d_json.revision = parseInt( buf_str.slice( 8, 10 ), 16 );

        let d_flag = parseInt( buf_str.slice( 10, 12 ), 16 );

        d_json.Unsynchronisation = ( ( d_flag >>> 7 ) & 1 ) === 1;

        d_json.extension = ( ( d_flag >>> 6 ) & 1 ) === 1;

        d_json.test = ( ( d_flag >>> 5 ) & 1 ) === 1;

        d_json.size = ( parseInt( buf_str.slice( 12, 14 ), 16 ) & 0x7F ) * 0x200000
                        + ( parseInt( buf_str.slice( 14, 16 ), 16 ) & 0x7F ) * 0x400
                        + ( parseInt( buf_str.slice( 16, 18 ), 16 ) & 0x7F ) * 0x80
                        + ( parseInt( buf_str.slice( 18, 20 ), 16 ) & 0x7F );

        return d_json;
    }

    /**
     * 计算帧头数据
     * 
     * @params {string} buf_str 十六进制的字符串
     * 
     * @returns {Error|Object} 返回错误信息或 json 数据
     */
    compute_Frame_header ( buf_str ) {

        let d_is_match = /^[0-9a-fA-F]{8}$/.test( buf_str );

        // if ( !d_is_match ) return new Error( '格式错误[E001]\n> 请输入四位十六进制的数据\n> 例如 “FF FB 90 00” 或 “FFFB9000”' );
        if ( !d_is_match ) return new Error( this.CODE.E001 );

        let
            d_16 = parseInt( buf_str, 16 ),
            d_json = {
                sync                : null,
                version             : 0,
                layer               : 0,
                CRC                 : false,
                bit                 : 0,
                sample              : 0,
                padding             : 0,
                extension           : null,
                channel_mode        : 0,
                mode_extension      : 0,
                copyright           : false,
                original            : false,
                emphasis            : 0,
                frame_size          : 0,
                frame_length        : 0,
            };

        d_json.version = ( d_16 >>> 19 ) & 1 === 1 ? 1 : ( d_16 >>> 20 ) & 1 === 1 ? 2 : 2.5;

        d_json.layer = 4 - ( d_16 >>> 17 ) & parseInt( '11', 2 ); // 取移位后的最后 2 位

        d_json.CRC = !!( ( d_16 >>> 16 ) & 1 === 1 );

        d_json.bit = ( () => {

            let d_data_view = [
                // mpeg 1
                [
                    // layer 1
                    [ 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448 ],
                    // layer 2
                    [ 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384 ],
                    // layer 3
                    [ 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320 ]
                ],
                // mpeg 2
                [
                    // layer 1
                    [ 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256 ],
                    // layer 2
                    [ 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160 ],
                    // layer 3
                    [ 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160 ]
                ]
            ];

            let d_index = ( d_16 >>> 12 ) & parseInt( '1111', 2 ); // 取移位后的最后 4 位
            
            return d_data_view[ ~~d_json.version - 1 ][ d_json.layer - 1 ][ d_index - 1 ] * 1000;
        } )();

        d_json.sample = ( () => {

            let d_data_view = [
                // mpeg 1
                [ 44100, 48000, 32000 ],
                // mpeg 2
                [ 22050, 24000, 16000 ]
            ];

            let d_index = ( d_16 >>> 10 ) & parseInt( '11', 2 ); // 取移位后的最后 2 位

            return d_data_view[ ~~d_json.version - 1 ][ d_index ];
        } )();

        d_json.padding = ( d_16 >>> 9 ) & 1;

        d_json.channel_mode = ( () => {
            switch ( ( d_16 >>> 6 ) & parseInt( '11', 2 ) ) { // 取移位后的最后 2 位
                case parseInt( '00' ) :
                    return 'stereo，立体声Stereo';
                case parseInt( '01' ) :
                    return 'join stereo，联合立体声';
                case parseInt( '10' ) :
                    return 'dual channel，双通道';
                case parseInt( '11' ) :
                    return 'single channel，单通道';
            }
        } )();

        d_json.mode_extension = ( () => {
            switch ( ( d_16 >>> 4 ) & parseInt( '11', 2 ) ) { // 取移位后的最后 2 位
                case parseInt( '00' ) :
                    return 'MPG_MD_LR_LR';
                case parseInt( '01' ) :
                    return 'MPG_MD_LR_I';
                case parseInt( '10' ) :
                    return 'MPG_MD_MS_LR';
                case parseInt( '11' ) :
                    return 'MPG_MD_MS_I';
            }
        } )();

        d_json.copyright = !!( ( d_16 >>> 3 ) & 1 === 1 );

        d_json.original = !!( ( d_16 >>> 2 ) & 1 === 1 );

        d_json.emphasis = ( () => {
            switch ( d_16 & parseInt( '11', 2 ) ) { // 取移位后的最后 2 位
                case parseInt( '00' ) :
                    return 'none';
                case parseInt( '01' ) :
                    return '50/15 microsecs';
                case parseInt( '10' ) :
                    return 'reserved';
                case parseInt( '11' ) :
                    return 'CCITT J 17';
            }
        } )();

        d_json.frame_size = ( () => {

            let d_data_view = [
                // mpeg 1
                [ 384, 1152, 1152 ],
                // mpeg 2
                [ 384, 1152, 576 ],
                // mpeg 2.5
                [ 384, 1152, 576 ]
            ];

            return d_data_view[ Math.ceil( d_json.version ) - 1 ][ d_json.layer - 1 ];
        } )();

        d_json.frame_length = ~~( d_json.frame_size / 8 * d_json.bit / d_json.sample + d_json.padding * ( d_json.layer === 1 ? 4 : 1 ) );

        return d_json;
    }
}