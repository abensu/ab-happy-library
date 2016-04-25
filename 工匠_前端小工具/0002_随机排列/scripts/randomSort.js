/**
 * 随机排列，输出数组
 *
 * @param {*} arr_or_other  : [] 数组或其他数据
 *
 * @return                  : [ [] ] 返回新排列的数组
 */
function randomSort( arr_or_other ) {

    var
        d_old_arr     = arr_or_other instanceof Array ? [].concat( arr_or_other ) : String( arr_or_other ).split( "" ),
        d_new_arr     = [],
        d_each_len    = 0;

    while ( d_each_len = d_old_arr.length ) {

        var
            d_index = Math.random() * d_each_len,
            d_cell  = d_old_arr.splice( d_index, 1 )[ 0 ];

        d_new_arr.push( d_cell );
    }

    return d_new_arr;
};