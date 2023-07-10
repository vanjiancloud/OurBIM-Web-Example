<!--
 * @Author: zk
 * @Date: 2021-05-06 15:42:41
 * @LastEditors: zk
 * @LastEditTime: 2021-07-30 11:26:41
 * @description: 
-->
# 说明

外部网页与OurBIM平台通信的postMessage的基本用法和事件。

## 监听消息

OurBIM平台在iframe内部通过构件树 postMessage方法向外部抛出事件。

可以通过以下方法监听：

window.addEventListener("message", function(e) {
    console.log("receive message." + e.data.prex, e.data.type, e.data.message, e.data.data);
}, false);

/**
    * @description:
    * e.data.prex 为"ourbimMessage"，用来标识信息来源的标识
    * e.data.type 为消息类型
    * e.data.data 为消息的详细信息
    * e.data.message 为附加信息
    10000:全部的通信，和WebSocket一致
    * 模型加载
    * 10001: 已获取平台资源，开始初始化
    * data: {
    *   taskId: ''  
    * }
    * 10002：基础环境加载中 [0, 1]
    * 10003：bim模型加载中 [0, 1]
    
    * 构件相关
    * 20001：单击模型浏览器构件

    * 标签相关
    * 30001：点击标签列表
    * data: {
    *    state: true // 是否选中
    *    tagId: "111" // 标签ID
    *    tagType: 0/1 // 标签类型 0 标签 1 标签组
    *}
    shareCode：分享链接协同操作code
*/


## 发送消息 

通过调用OurBIM平台iframe的window对象的postMessage方法向平台内部传递数据。

数据类型如下：

function sendToIframe(type, data, message) {
    if ($("#iframe").get(0).contentWindow) {
        var win = $("#iframe").get(0).contentWindow;
        win.postMessage({
            prex: "ourbimMessage", // 约定的消息头部
            type: type,         // 消息类型
            data: data,         // 具体数据
            message: message,   // 附加信息
        },'*');
    } else {
        console.warn('content window not find.');
    }
}

// 操作指令
// 控制栏整体显示/隐藏
    type = 1001 
    data = true/false
// 选择性隐藏工具栏
    type = 1002
    data = ['show','selection']
// 选择性显示工具栏
    type = 1003
    data = ['show','selection']
// viewcube显示/隐藏
    type = 1015
    data = true/false