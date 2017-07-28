var MyClipboard = {

    /**
     * 具有复制功能的元素的 id
     */
    node_id : 'copy-src',

    /**
     * 初始化（页面加载完调用）
     */
    init : function() {

        var n_self = this;

        var n_copy_src = document.createElement( 'span' );

        n_copy_src.id = n_self.node_id;
        n_copy_src.style.display = 'none';
        n_copy_src.setAttribute( 'data-clipboard-text', '' );

        document.body.appendChild( n_copy_src );

        var clipboard = new Clipboard( '#' + n_self.node_id );

        clipboard.on( 'success', function(e) {
            typeof n_self.success === 'function' && n_self.success( e );
        } );

        clipboard.on( 'error', function(e) {
            typeof n_self.error === 'function' && n_self.error( e );
        } );
    },

    /**
     * 复制成功的回调
     */
    success : function( e ) {},

    /**
     * 复制失败的回调
     */
    error : function(e) {},

    /**
     * 复制文本
     * 
     * @param {string} copy_text 需要复制的文本
     */
    copy : function( copy_text ) {

        var n_copy_src = document.getElementById( this.node_id );

        n_copy_src.setAttribute( 'data-clipboard-text' , copy_text );

        n_copy_src.click();
    }
};