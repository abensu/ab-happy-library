class MyBaby extends eui.Component implements eui.UIComponent {

    // 需要手动写入有效的 ID
    // 命名对应 MyBaby.exml 中，设置好的内部元素 ID
    // mytext 对应已插入的 ID 同名 Label 元素
    public mytext: eui.Label;

    public ani_for_start: egret.tween.TweenGroup; // 需要手动写入有效的 ID

    public constructor () {

        super();

        // this.mytext.addEventListener( egret.TouchEvent.TOUCH_TAP, () => {

        //     this.ani_for_start.play( 0 );

        // }, this );
    }

    protected partAdded ( partName: string, instance: any ): void {

        super.partAdded( partName, instance );
    }

    // 类似 Vue 的 mounted 阶段
    protected childrenCreated (): void {

        super.childrenCreated();

        // 设置 Label 的文案
        this.mytext.text = 'Hello Kitty';

        this.ani_for_start.play( 0 ); // 从第一帧播放动画

        // 点击重播动画
        this.mytext.addEventListener( egret.TouchEvent.TOUCH_TAP, () => {

            this.ani_for_start.play( 0 );

        }, this );
    }
}