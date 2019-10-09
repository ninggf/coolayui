layui.define(['jquery'], function(exports) {
    var $ = layui.$;
    exports('$default.home', function() {
        console.log('theme default inited');
        $('h2').after($('<h2>theme default inited</h2>'))
    });
});
