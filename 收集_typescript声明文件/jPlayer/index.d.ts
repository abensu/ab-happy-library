// 具体用法请查看 http://jplayer.org/latest/developer-guide/

interface JQueryStatic {
    // jPlayer(o: any, options?: any): JQuery;
    jPlayer : any;
}

interface JQuery {
    jPlayer : any;
}

interface jPlayerEventError {

    /** The error event code */
    type : string,

    /** The cause of the error */
    context : string,

    /** Message describing the error */
    message : string,

    /** A suggestion on how to fix the error */
    hint : string,
}

interface jPlayerEventStatus {

    /** The URL being used by jPlayer */
    src : string,

    /** Pointer to the media object used in setMedia */
    media : any,

    /** 加载文件进度（单位：百分比） */
    seekPercent : number,

    /** Current time as a percent of seekPercent */
    currentPercentRelative : number,

    /** Current time as a percent of duration */
    currentPercentAbsolute : number,

    /** 当前播放时间（单位：秒） */
    currentTime : number,

    /** 完整时长（单位：秒） */
    duration : number,

    /** 剩余时间（单位：秒） */
    remaining : number,

    /** ? */
    srcSet : boolean,

    /** ? */
    paused : boolean,

    /** ? */
    waitForPlay : boolean,

    /** ? */
    waitForLoad : boolean,

    /** ? */
    video : boolean,

    /** The current CSS style width of jPlayer */
    width : string,

    /** The current CSS style height of jPlayer */
    height : string,

    /** The intrinsic width of the video in pixels. (Zero before known or if audio.) */
    videoWidth : number,

    /** The intrinsic height of the video in pixels. (Zero before known or if audio.) */
    videoHeight : number,

    /** version object */
    version : {

        /** jPlayer's JavaScript version */
        script : string,

        /** jPlayer's Flash version, or "unknown" if Flash is not being used */
        flash : string,

        /** The Flash version compatiable with the JavaScript */
        needFlash : string,
    },

    /** warning object */
    warning : {

        /** The warning event code */
        type : string,

        /** The cause of the warning */
        context : string,

        /** Message describing the warning */
        message : string,

        /** A suggestion on how to fix the warning */
        hint : string,
    },
}

interface jPlayerEvent extends Event {

    /** The jPlayer information object */
    jPlayer : {

        /** error object */
        error : jPlayerEventError,

        /** Info about the Flash solution */
        flash : any,

        /** Info about the HTML solution */
        html : any,

        /** The jPlayer options. The volume and muted values are maintained here along with all the other options. */
        options : any,

        /** status object */
        status : jPlayerEventStatus,
    }
}