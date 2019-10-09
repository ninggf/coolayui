layui.define(['jquery'], function(exports) {
    var $ = layui.$;

    exports('@app.home', function() {
        console.log('app home inited');
        $('h1').after($('<h2>module app inited</h2>'));
    });
});
