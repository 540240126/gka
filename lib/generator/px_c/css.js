
/*
* css 生成
*
*/

var sizeOf = require('image-size');
var fs = require('fs');
var path = require('path');

function fixpath(dist) {
  return dist.replace(/\\/, "/");
}

function gcss(obj, callback) {
    var frameDuration = obj.frameDuration,
        src2distrelative = obj.src2distrelative,
        src2cutinfo = obj.src2cutinfo,
        prefix = obj.prefix;

    var css = "";
    var dist = "";
    var len = Object.keys(src2distrelative).length;
    var per = 100 / (len - 1);  // per * max(i) = 100%

    // 图片的宽高 
    var width = "",
        height = "",
        info = {};

    var i = 0,
        percent = 0,
        keyframesStr = "";

    for (var src in src2distrelative) {
        if (!width) {
            var d = sizeOf(src);
            width = d.width,
            height = d.height; 
        }

        // 指向的地址
        dist = src2distrelative[src];
        info = src2cutinfo[src];

        percent = (i * (per)).toFixed(2);
        percent = percent == 0? 0: percent; // fix 0.00 to 0;

        // 生成 keyframes
        keyframesStr += `
    ${percent}%{
        width: ${info.w}px;
        height: ${info.h}px;
        transform: translate(${info.offX}px, ${info.offY}px);
        background-image: url("${fixpath(dist)}");
    }
`;
        ++i;

    }

    css += `.gka-wrap {
    // width: ${info.sourceW}px;
    height: ${info.sourceH}px;
}

`;

    css += `.gka-base {
   
    background-repeat: no-repeat;
    background-position: center center;
    
    /* background-size: contain;*/
    
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    
    animation-timing-function: steps(1);

    /* 只播放一次，播放停止到最后一帧*/
    /* animation-iteration-count: 1; */ 
}

`;

    css += `.${prefix}animation {
    animation-name: ${prefix}keyframes;
    animation-duration: ${len * frameDuration}s;
}

@-webkit-keyframes ${prefix}keyframes {${
    keyframesStr
}
}
`;

    callback && callback(`${prefix}gka_cut.css`, css);
}

module.exports = gcss;
