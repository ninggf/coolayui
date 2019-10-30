# Coolayui

基于[layui](https://github.com/sentsin/layui/)的后台管理界面。

## 使用

到[releases](https://github.com/ninggf/coolayui/releases)下载最新版本并解压，然后参考`demo`开始使用：

1. layui[文档](https://www.layui.com/doc/)
2. coolay[文档](https://coolay.wulaphp.com/)

## 配置

相比layui，coolay扩展了三个配置: `devMode`, `module`和`theme`：

```js
layui.config({
    devMode: "1",// 开发模式
    module: '/modules/',
    theme: '/themes/',
    base: '/thirdjs/'
});

layui.use(['layer','&coolay','@app.module','$default.mod','third'],function(){
    // your code is here
});
```

1. `&`引用layui安装目录里`lay/exts`下的库
   * `&coolay`对应的文件为`lay/exts/coolay.js`
   * 项目开发的库(组件)都是此类
2. `@`引用`config.module`目录下的库
   * `@app.module`对应的文件为`/modules/app/js/module.js`
3. `$`引用`config.theme`目录下的库
   * `$default.mod`对应的文件为`/themes/default/js/mod.js`
4. 其它
   1. layui内置模块从`lay/modules`目录加载
   2. 第三方库,如`third`从`config.base`指定的目录加载,如从[三方组件](https://fly.layui.com/extend/)下载的库

## 参与开发

`node version: 12.12`

1. `git clone https://github.com/ninggf/coolayui.git`
2. `cd coolayui && git submodule update --init --recursive`
3. `npm ci`
4. `gulp watch`

> 欢迎提交`pr`或`issue`。
