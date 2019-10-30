layui.define(['jquery'], (exports) => {
    'use strict';

    const $ = layui.$;

    const Coolay = (elem, opts) => {

    };

    $.fn.coolay = function(opts) {
        const that = $(this);
        new Coolay(that, opts);
        return that;
    };

    console.log('coolayui inited');

    exports('&coolay', Coolay);
});
