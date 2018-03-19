/** 
 * 用户账号JS SDK 
 * 
 * @author aben
 * @since 2018/03/19
 */
declare namespace KgUser {

    /** 登录/注册成功获得的用户信息（Login 等回调参数中传入） */
    export interface UserInfo {

        /** 用户名 */
        username : string,

        /** 用户呢称 */
        nickname : string,

        /** 用户 ID */
        userid : number,

        /** 用户令牌 */
        token : string,

        /** 用户头像全地址，含http */
        pic : string,
    }

    /** 登录/注册失败获得的错误信息（Login 等回调参数中传入） */
    export interface ErrorInfo {

        /** 错误信息 */
        errorMsg : string,

        /** 错误码 */
        errorCode : number,
    }

    /** 检测密码强度获得的信息（CheckPwd 回调参数中传入） */
    export interface PwdStrongInfo {

        /** 状态码：0=失败；1=成功 */
        status : 0 | 1,

        /** 错误码 */
        error_code : number,

        /** 是否是弱口令：1=弱口令；0=非弱口令（弱口令如：123456，连续数字，密码和手机号一样等） */
        data : 1 | 0,
    }

    /** 检测用户名是否存在获得的信息（CheckReg 回调参数中传入） */
    export interface UserNameExistInfo {

        /** 1 该username已经给注册，0 该username还没给注册 */
        data : 0 | 1,
    }

    /** 获取的手机验证码状态（CheckReg 回调参数中传入） */
    export interface GetSmsCodeInfo {

        /** 状态码，9：成功 */
        data : number,
    }

    /** Login 接口使用的数据对象 */
    export interface LoginParams {

        /** 应用id */
        appid : number,

        /** 可以是用户名 、id，手机，邮箱 */
        username : string,

        /** 密码(不需要编码或者替换处理，保持客户输入原样) */
        pwd : string,

        /** 验证码（出现验证码才需要填写） */
        code ?: string,

        /** 腾讯划卡验证码 */
        ticket ?: string,

        /** 是否自动登录 */
        autologin ?: boolean,

        /** Cookie有效期(天)，默认为1天 */
        expire_day ?: number,

        /** state>0 表示会触发非常用设备，并且绑定手机，需要采用手机验证码登录。 */
        state ?: number,

        /** 如果调用该方法返回 30798 错误码，则进入输入手机页面 */
        mobile ?: string,

        /** 手机收到的验证码 */
        mobile_code ?: string,
    }

    /** VerifyCode 接口使用的数据对象 */
    export interface VerifyCodeParams {
        
        /** 应用id */
        appid : number,
        
        /** 显示验证码的DOM节点id名称 */
        codeid ?: string,
        
        /** 验证码位数，默认6位 */
        len ?: number,
        
        /** 验证码图片宽度，默认90像素 */
        width ?: number,
        
        /** 验证码图片高度，默认40像素 */
        height ?: number,
        
        /** 验证码业务类型，默认为登录 “LoginCheckCode”；注册时，该值需要为 “RegCheckCode”；发短信时，为 “SmsCheckCode" */
        type ?: 'LoginCheckCode' | 'RegCheckCode' | 'SmsCheckCode',
        
        /** 需要隐藏的dom节点id名称；当tyep=RegCheckCode时，该元素必须传。如：验证码输入框id和换一换验证码文字链等；多个id采用逗号隔开 */
        inputid ?: string,
        
        /** 验证码类型，0 普通验证码；1 九宫格；3 腾讯划块验证码 */
        codetype ?: 0 | 1 | 3,

        /** 验证成功回调 */
        success ?: ( ticket: any ) => void,

        /** 关闭滑动验证码回调 */
        close ?: () => void,

        /** 更新滑动验证码回调 */
        update ?: () => void,

        /** 加载腾讯验证码，true 表示成功回调，false 表示失败回调 */
        callback ?: ( status: boolean ) => void,

        /** 加载腾讯验证码超时时间(ms) */
        timeout ?: number,
    }

    /** ThirdLogin 接口使用的数据对象 */
    export interface ThirdLoginParams {

        /** 应用id */
        appid : number,

        /** 第三方应用，如：qqweibo(QQ微博)、qzone(QQ)、sina(新浪)、renren(人人)、weixin(微信)、esurfing(天翼) */
        partner : 'qqweibo' | 'qzone' | 'sina' | 'renren' | 'weixin' | 'esurfing',
    }

    /** CheckVerifyCode 接口使用的数据对象 */
    export interface CheckVerifyCodeParams {

        /** appid */
        appid : number,

        /** 用户名 */
        username : string,
    }

    /** RegByUserName 接口使用的数据对象 */
    export interface RegByUserNameParams {

        /** 应用id */
        appid : number,

        /** 用户名 */
        username : string,

        /** 密码(不需要编码或者替换处理，保持客户输入原样) */
        password : string,

        /** 验证码 */
        code : string,

        /** 性别(1男，0女)，默认值1 */
        sex ?: 1 | 0,

        /** 昵称，不传默认和用户名一样 */
        nickname ?: string,

        /** 安全邮箱 */
        security_email ?: string,

        /** 身份证号码 */
        id_card ?: string,

        /** 真实姓名 */
        truename ?: string,

        /** Cookie有效期(天)，默认为1天 */
        expire_day ?: string,
    }

    /** RegByMobile 接口使用的数据对象 */
    export interface RegByMobileParams {

        /** 应用id */
        appid : number,

        /** 手机号码 */
        mobile : string,

        /** 密码(不需要编码或者替换处理，保持客户输入原样) */
        password : string,

        /** 预留字段：表示密码是否随机 random=1 表示password是前端生成的，此时密码随机请填 8位 大小写字母数字随机产生的字符串。后端可能会以此参数再重新生成随机密码，并给用户下发短信。 */
        random ?: number,

        /** 手机验证码 */
        code : string,

        /** 性别(1男，0女)，默认值1 */
        sex ?: 0 | 1,

        /** 昵称，不传默认和手机号码一样 */
        nickname ?: string,

        /** Cookie有效期(天)，默认为1天 */
        expire_day ?: number,

        /** 预留字段：传1 表示要强制的注册这个手机号 */
        force_reg ?: number,
    }

    /** RegByEmail 接口使用的数据对象 */
    export interface RegByEmailParams {

        /** 应用id */
        appid : number,

        /** 邮箱 */
        email : string,

        /** 密码(不需要编码或者替换处理，保持客户输入原样) */
        password : string,

        /** 验证码（出现验证码才需要填写） */
        code ?: string,

        /** 性别(1男，0女)，默认值1 */
        sex ?: 0 | 1,

        /** 昵称，不传默认和邮箱一样 */
        nickname ?: string,

        /** Cookie有效期(天)，默认为1天 */
        expire_day ?: number,
    }

    /** GetSmsCode 接口使用的数据对象 */
    export interface GetSmsCodeParams {

        /** 应用id */
        appid : number,

        /** 手机号码 */
        mobile : string,

        /** 业务类型，默认reg，登录(login)、注册(reg)绑手机（bind） */
        type ?: 'reg' | 'login' | 'bind',

        /** 图片验证码 */
        verifycode : string,
    }

    /** CheckPwd 接口使用的数据对象 */
    export interface CheckPwdParams {

        /** 应用id */
        appid : number,

        /** 密码(不需要编码或者替换处理，保持客户输入原样) */
        password : string,

        /** 用户注册，填入的用户名、手机、邮箱等 */
        username ?: string,
    }

    /** CheckCode 接口使用的数据对象 */
    export interface CheckCodeParams {

        /** 应用id */
        appid : number,

        /** 验证码值 */
        code : string,

        /** 验证码业务类型，默认为登录“LoginCheckCode”，注册时，该值需要为“RegCheckCode” */
        type ?: 'LoginCheckCode' | 'RegCheckCode',
    }

    /** LoginByVerifycode 接口使用的数据对象 */
    export interface LoginByVerifycodeParams {

        /** 应用id */
        appid : number,

        /** 手机号 */
        mobile : string,

        /** 手机验证码 */
        code : string,

        /** Cookie有效期(天)，默认为1天 */
        expire_day ?: number,
    }

    /** CheckReg 接口使用的数据对象 */
    export interface CheckRegParams {

        /** 应用id */
        appid : number,

        /** 分别是用户填入的用于登录的登录名，可以是用户名，手机、邮箱 */
        username : string,

        /** 1 用户名，2 手机，3 邮箱 */
        type : 1 | 2 | 3,
    }

    /** RegByMobile 接口使用的数据对象 */
    export interface CheckRegMobileParams {

        /** 应用id */
        appid : number,

        /** 手机号码 */
        mobile : string,

        /** 手机验证码 */
        code : string,

        /** 固定填 check */
        type : 'check',
    }

    /** 
     * 普通账号密码登录
     * 
     * @param {LoginParams} infoObj     用户对象
     * @param {string} callbackName     回调函数名称
     */
    function Login ( infoObj: LoginParams, callbackName: string ): void;

    /** 
     * 显示验证码
     * 
     * @param {VerifyCodeParams} codeObj 验证码对象
     */
    function VerifyCode ( codeObj: VerifyCodeParams ): void;

    /** 
     * 第三方登录
     * 
     * @param {ThirdLoginParams} infoObj    验证码对象
     * @param {string} callbackName         回调函数名称
     */
    function ThirdLogin ( infoObj: ThirdLoginParams, callbackName: string ): void;

    /** 
     * 退出登录
     * 
     * @param {number} appid 应用id
     */
    function LoginOut ( appid: number ): void;

    /** 
     * 普通登录检测是否需要验证码
     * 
     * @param {CheckVerifyCodeParams} infoObj 验证码对象
     */
    function CheckVerifyCode ( infoObj: CheckVerifyCodeParams ): void;

    /** 
     * 用户名注册账号
     * 
     * @param {RegByUserNameParams} infoObj 用户对象
     * @param {string} callbackName         回调函数名称
     */
    function RegByUserName ( infoObj: RegByUserNameParams, callbackName: string ): void;

    /** 
     * 手机注册账号
     * 
     * @param {RegByMobileParams} infoObj   用户对象
     * @param {string} callbackName         回调函数名称
     */
    function RegByMobile ( infoObj: RegByMobileParams, callbackName: string ): void;

    /** 
     * 检查注册手机号短信验证码是否正确
     * 
     * @param {CheckRegMobileParams} infoObj    验证码对象
     * @param {string} callbackName             回调函数名称
     */
    function RegByMobile ( infoObj: CheckRegMobileParams, callbackName: string ): void;

    /** 
     * 邮箱注册账号
     * 
     * @param {RegByEmailParams} infoObj    用户对象
     * @param {string} callbackName         回调函数名称
     */
    function RegByEmail ( infoObj: RegByEmailParams, callbackName: string ): void;

    /** 
     * 获取手机验证码
     * 
     * @param {GetSmsCodeParams} infoObj    验证码对象
     * @param {string} callbackName         回调函数名称
     */
    function GetSmsCode ( infoObj: GetSmsCodeParams, callbackName: string ): void;

    /** 
     * 检测是否是弱口令
     * 
     * @param {CheckPwdParams} infoObj  验证码对象
     * @param {string} callbackName     回调函数名称
     */
    function CheckPwd ( infoObj: CheckPwdParams, callbackName: string ): void;

    /** 
     * 实时检测验证码是否正确
     * 
     * @param {CheckCodeParams} infoObj 验证码对象
     * @param {string} callbackName     回调函数名称
     */
    function CheckCode ( infoObj: CheckCodeParams, callbackName: string ): void;

    /** 
     * 手机号和验证码登录
     * 
     * @param {LoginByVerifycodeParams} infoObj 验证码对象
     * @param {string} callbackName             回调函数名称
     */
    function LoginByVerifycode ( infoObj: LoginByVerifycodeParams, callbackName: string ): void;

    /** 
     * 检测登录名是否给注册（包括手机、邮箱、用户名）
     * 
     * @param {CheckRegParams} infoObj  验证码对象
     * @param {string} callbackName     回调函数名称
     */
    function CheckReg ( infoObj: CheckRegParams, callbackName: string ): void;
}