/**
 * 事件寄存
 * 
 * @author abensu
 * @since 2017/5/4
 */
class ABDelegate {

    /**
     * 绑定函数的缓存区
     */
    private funcHash = {};

    /**
     * 事件寄存
     * 
     * @example
     * <pre>
     *     let delegate = new Delegate();
     *     let box = new egret.DisplayObject();
     *     let img1 = new egret.Bitmap();
     *     let img2 = new egret.Bitmap();
     *     let fn = ( evt: egret.TouchEvent ) => { alert( "hello" ) };
     *
     *     img1.texture = img2.texture = RES.getRes( "sth_png" );
     *     img1.name = img2.name = "bobo_img";
     *     img2.x = 50;
     *     box.addChild( img1 );
     *     box.addChild( img2 );
     *     this.stage.addChild( box );
     *
     *     // 绑定事件，点击图片，弹出 “hello” 信息
     *     delegate.bind( this.stage, img1, egret.TouchEvent.TOUCH_TAP, fn, this.stage );
     *     delegate.bind( this.stage, img2, egret.TouchEvent.TOUCH_TAP, fn, this.stage );
     *     // 解绑事件
     *     // delegate.unbind( this.stage, img1, egret.TouchEvent.TOUCH_TAP, fn, this.stage );
     *     // delegate.unbind( this.stage, img2, egret.TouchEvent.TOUCH_TAP, fn, this.stage );
     * 
     *     // 或使用 name 值去绑定事件，这样同 name 元素都会调用同一事件
     *     delegate.bind( this.stage, "bobo_img", egret.TouchEvent.TOUCH_TAP, fn, this.stage );
     *     // delegate.unbind( this.stage, "bobo_img", egret.TouchEvent.TOUCH_TAP, fn, this.stage );
     * </pre>
     */
    public constructor() {}

    /**
     * 绑定事件
     * 
     * @param root {egret.DisplayObject} 根结点
     * @param targetOrName {egret.DisplayObject|string} 根结点下的目标节点或其 name 值
     * @param eventType {string} 事件类型
     * @param func {Function} 绑定函数
     * @param thisObj {any} this 对象
     */
    public bind( root: egret.DisplayObject, targetOrName: egret.DisplayObject | string, eventType: string, func: ( evt: egret.Event ) => void, thisObj: any ) {

        let d_funcHash_names    = this.createFuncHashKeys( root, targetOrName, eventType );
        let d_funcHash_func     = this.createFuncHashNewFunc( root, targetOrName, eventType, func, thisObj );

        this.saveFuncToFuncHash( d_funcHash_names[ 0 ], d_funcHash_names[ 1 ], func, d_funcHash_func );
        
        root.addEventListener( eventType, d_funcHash_func, thisObj );
    }

    /**
     * 解绑事件
     * 
     * @param root {egret.DisplayObject} 根结点
     * @param targetOrName {egret.DisplayObject|string} 根结点下的目标节点或其 name 值
     * @param eventType {string} 事件类型
     * @param func {Function} 绑定函数
     */
    public unbind( root: egret.DisplayObject, targetOrName: egret.DisplayObject, eventType: string, func: ( evt: egret.Event ) => void, thisObj: any ) {

        let d_funcHash_names    = this.createFuncHashKeys( root, targetOrName, eventType );
        let d_funcHash_newFuncs = this.removeFuncFromFuncHash( d_funcHash_names[ 0 ], d_funcHash_names[ 1 ], func );
        
        for ( let i = d_funcHash_newFuncs.length; i--; ) {

            root.removeEventListener( eventType, d_funcHash_newFuncs[ i ], thisObj );
        }
    }

    /**
     * 生成 funcHash 对应的键值序列，第 1 个是 "xxx$raw"，第 2 个是 "xxx$new"
     * 
     * @param root {egret.DisplayObject} 根结点
     * @param targetOrName {egret.DisplayObject|string} 根结点下的目标节点或其 name 值
     * @param eventType {string} 事件类型
     * 
     * @returns {Array} 共 2 个键值，第 1 个是 "xxx$raw"，第 2 个是 "xxx$new"
     */
    private createFuncHashKeys( root: egret.DisplayObject, targetOrName: egret.DisplayObject | string, eventType: string ): string[] {

        // 第二个加 0 是为了，如果传入的字符串为数字，避免与已存在的 hashCode 相冲突
        let d_funcHash_name = typeof targetOrName === 'object' ? `${root.hashCode},${targetOrName.hashCode},${eventType}` : `${root.hashCode},0${targetOrName},${eventType}`;

        return [ d_funcHash_name + '$raw', d_funcHash_name + '$new' ];
    }

    /**
     * 生成在 funcHash 对应的新函数
     * 
     * @param root {egret.DisplayObject} 根结点
     * @param targetOrName {egret.DisplayObject|string} 根结点下的目标节点或其 name 值
     * @param eventType {string} 事件类型
     * @param thisObj {any} this 对象
     * 
     * @returns {Function} 新函数
     */
    private createFuncHashNewFunc( root: egret.DisplayObject, targetOrName: egret.DisplayObject | string, eventType: string, func: ( evt: egret.Event ) => void, thisObj: any ): Function {

        if ( typeof targetOrName === 'object' ) {

            return function( targetHashCode: number, evt: egret.Event ) {

                evt.target.hashCode === targetHashCode && func.call( this, evt );

            }.bind( thisObj, targetOrName.hashCode );

        } else {

            return function( targetName: string, evt: egret.Event ) {

                evt.target.name === targetName && func.call( this, evt );

            }.bind( thisObj, targetOrName );
        }
    }

    /**
     * 保存函数到 funcHash
     * 
     * @param key {string} 键值
     * @param func {Function} 函数
     */
    private saveFuncToFuncHash( rawKey: string, newKey: string, rawFunc: Function, newFunc: Function ) {

        if ( !this.funcHash[ rawKey ] ) {

            this.funcHash[ rawKey ] = [];
            this.funcHash[ newKey ] = [];
        }

        this.funcHash[ rawKey ].push( rawFunc );
        this.funcHash[ newKey ].push( newFunc );
    }

    /**
     * 从 funcHash 移除源函数节点和新函数节点中某个或全部函数
     * 
     * @param rawKey {string} 源函数节点键值
     * @param newKey {string} 新函数节点键值
     * @param rawFunc {Function} 源函数
     * 
     * @returns {Array} 新函数的数组
     */
    private removeFuncFromFuncHash( rawKey: string, newKey: string, rawFunc?: Function ): Function[] {

        let d_new_funcs = [];

        if ( this.funcHash[ rawKey ] ) {

            if ( rawFunc ) {

                // 清除指定函数

                for ( let rawFuncList: Function[] = this.funcHash[ rawKey ], i = rawFuncList.length; i--; ) {

                    if ( rawFuncList[ i ] === rawFunc ) {

                        rawFuncList.splice( i, 1 );

                        d_new_funcs = this.funcHash[ newKey ].splice( i, 1 );

                        break;
                    }
                }

            } else {

                // 清除所有函数

                d_new_funcs = d_new_funcs.concat( this.funcHash[ newKey ] );

                this.funcHash[ rawKey ].length = 0;
                this.funcHash[ newKey ].length = 0;
            }
        }

        return d_new_funcs;
    }
}

/**
 * 全局仅使用该对象
 * 
 * @description 如无需要可删除
 */
let singleDelegate = new ABDelegate();