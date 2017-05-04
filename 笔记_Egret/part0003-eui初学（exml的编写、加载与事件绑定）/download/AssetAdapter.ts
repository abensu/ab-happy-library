/**
 * 素材适配器接口。
 * 若项目需要自定义 Image.source的解析规则，需要实现这个接口，
 * 然后调用如下代码注入自定义实现到框架即可：
 * <pre>
 *      let assetAdapter = new YourAssetAdapter();
 *      egret.registerImplementation("eui.IAssetAdapter",assetAdapter)
 * </pre>
 * @version Egret 2.4
 * @version eui 1.0
 * @platform Web,Native
 * @language zh_CN
 */

class AssetAdapter implements eui.IAssetAdapter {

    /**
     * @language zh_CN
     * 解析素材
     * @param source {string} 待解析的新素材标识符
     * @param compFunc {Function} 解析完成回调函数，示例：callBack( content: any, source: string ): void;
     * @param thisObject {any} callBack的 this 引用
     */
    public getAsset( source: string, compFunc: ( content: any, source: string ) => void, thisObject: any ): void {

        function onGetRes( data: any ): void {

            compFunc.call( thisObject, data, source );
        };

        if ( RES.hasRes( source ) ) {

            let data = RES.getRes( source );

            if ( data ) {

                onGetRes( data );

            } else {

                RES.getResAsync( source, onGetRes, this );
            }
        }
        else {

            RES.getResByUrl( source, onGetRes, this, RES.ResourceItem.TYPE_IMAGE );
        }
    }
}