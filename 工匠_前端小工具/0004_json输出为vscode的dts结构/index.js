/**
 * JSON 输出为 .d.ts 的结构
 */
var Json2Dts = {

    /**
     * 获取对象类型
     * 
     * @param {any} tar 检测数据
     * 
     * @returns {string} 数据类型名称
     */
    getType : function( tar ) {

        return Object.prototype.toString.call( tar ).toLowerCase().replace( /^.+?\s([^]+)]/, '$1' );
    },

    /**
     * 循环检测
     * 
     * @info
     *  1. 数组的话，只拿第一个做参考，所以不会出现 "key? : type" 这样的可选参数形式
     * 
     * @param {any}                 tar             操作对象
     * @param {string[]}            output_lines    行信息
     * @param {number|undefined}    level           层级
     * @param {string}              parent_type     上一级数据类型
     */
    loopCheck : function( tar, output_lines, level, parent_type ) {

        var
            d_type          = this.getType( tar ),
            d_level         = level || 0,
            d_blank         = '    ',
            d_pre_blank     = Array( d_level + 1 ).join( d_blank ),
            d_parent_type   = parent_type || '';

        switch ( d_type ) {
            
            case 'object' :

                if ( d_level ) {

                    output_lines[ output_lines.length - 1 ] += '{\n';

                } else {

                    output_lines[ 0 ] = '{';
                }

                for ( var key in tar ) {
                    
                    var
                        d_sub_pre_blank = Array( d_level + 2 ).join( d_blank ),
                        d_sub_type      = this.getType( tar[ key ] );
                    
                    switch( d_sub_type ) {
                        
                        case 'object' :
                        case 'array' :
                            output_lines.push( d_sub_pre_blank + '"' + key + '"' + ' : ' );
                            this.loopCheck( tar[ key ], output_lines, d_level + 1, d_type );
                            break;
                        
                        default :
                            output_lines.push( d_sub_pre_blank + '/** 如 ' + ( d_sub_type === 'string' ? '"' : '' ) + tar[ key ] + ( d_sub_type === 'string' ? '"' : '' ) + ' */' );
                            output_lines.push( d_sub_pre_blank + '"' + key + '"' + ' : ' + d_sub_type + ',\n' );
                            break;
                    }
                }
                
                output_lines[ output_lines.length - 1 ] = output_lines[ output_lines.length - 1 ].replace( /\s$/, '' );
                output_lines.push( d_pre_blank + '},\n' );
                break;
            
            case 'array' :
                this.loopCheck( tar[ 0 ], output_lines, d_level, d_type );
                // modify start
                // for ( var i = 0, len = tar.length; i < len; i++ ) {
                //     this.loopCheck( tar[ i ], output_lines, d_level, d_type );
                //     console.log( output_lines );
                // }
                // modify end
                output_lines[ output_lines.length - 1 ] = output_lines[ output_lines.length - 1 ].replace( /[,\s]*$/, '[],\n' );
                break;
                
            default :
            
                if ( output_lines.length ) {

                    output_lines[ output_lines.length - 1 ] += d_type;

                } else {

                    output_lines.push( d_pre_blank + d_type + ',' );
                }
                break;
        }
    },
    
    /**
     * 转换数据数 .d.ts 的数据结构
     *
     * @param {any} tar 检测数据
     * 
     * @returns {string[]} 结果值
     */
    toDts : function( tar ) {

        var d_output_lines = [];

        this.loopCheck( tar, d_output_lines );

        return d_output_lines.join( '\n' ).replace( /[,\s]*$/, '' );
    },
};

// ========== 分隔线 ==========

var
    n_doc       = document,
    n_input     = n_doc.getElementById( 'input' ),
    n_output    = n_doc.getElementById( 'output' );

n_input.addEventListener( 'change', function() {

    var d_val = this.value;

    this.value = JSON.stringify( eval( '(' + d_val + ')' ), null, 2 );

    var
        d_input     = n_input.value.trim(),
        d_input_tar = JSON.parse( d_input );

    n_output.value = Json2Dts.toDts( d_input_tar );

}, false );