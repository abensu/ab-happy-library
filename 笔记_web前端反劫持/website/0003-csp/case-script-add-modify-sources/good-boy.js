

// 假设原脚本不变，仅在后面添加如下脚本

var n_a = document.createElement( 'a' );

n_a.textContent         = '劫持你的脚本了(#^.^#)';
n_a.style.position      = 'fixed';
n_a.style.left          = 0;
n_a.style.right         = 0;
n_a.style.top           = 0;
n_a.style.bottom        = 0;
n_a.style.background    = 'rgba(255,0,0,0.5)';
n_a.target              = '_blank';
n_a.href                = 'https://www.baidu.com/';

document.body.appendChild( n_a );