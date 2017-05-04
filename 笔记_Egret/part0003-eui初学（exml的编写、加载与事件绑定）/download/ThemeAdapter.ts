/**
 * 主题适配器接口。
 * 若项目需要自定义主题需要实现这个接口，
 * 然后调用如下代码注入自定义实现到框架即可：
 * <pre>
 *      let themeAdapter = new YourThemeAdapter();
 *      egret.registerImplementation("eui.IThemeAdapter",themeAdapter);
 * </pre>
 * @version Egret 2.4
 * @version eui 1.0
 * @platform Web,Native
 * @language zh_CN
 */

class ThemeAdapter implements eui.IThemeAdapter {

    /**
     * 解析主题
     * @param url {string} 待解析的主题url
     * @param compFunc {Function} 解析完成回调函数，示例：compFunc(e: egret.Event):void;
     * @param errorFunc {Function} 解析失败回调函数，示例：errorFunc():void;
     * @param thisObject {any} 回调的this引用
     */
    public getTheme( url: string, compFunc: ( e: egret.Event ) => void, errorFunc: () => void, thisObject: any ): void {

        function onGetRes( e: string ): void {

            compFunc.call( thisObject, e );
        };

        function onError( e: RES.ResourceEvent ): void {

            if( e.resItem.url == url ) {

                RES.removeEventListener( RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null );

                errorFunc.call( thisObject );
            }
        };

        RES.addEventListener( RES.ResourceEvent.ITEM_LOAD_ERROR, onError, null );
        RES.getResByUrl( url, onGetRes, this, RES.ResourceItem.TYPE_TEXT );
    }
}