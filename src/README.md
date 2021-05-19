<!--
 * @Author: zk
 * @Date: 2021-05-06 15:42:41
 * @LastEditors: zk
 * @LastEditTime: 2021-05-19 13:43:13
 * @description: 
-->
# 说明

外部网页与OurBIM平台通信的postMessage的基本用法和事件。

## 监听消息

OurBIM平台在iframe内部通过浏览器 postMessage方法向外部抛出事件。

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
    * 模型加载
    * 10001: 已获取平台资源，开始初始化
    * 10002：平台初始化成功
    * 10003：平台加载成功
    
    * 构件相关
    * 20001：单击构件
    * 20002: 框选构件
    * 20003：点击空白

    * 标签相关
    * 30001：点击标签
    * data: {
    *    state: true // 是否选中
    *    tagId: "111" // 标签ID
    *}
    * 30002: 构件新建成功
    * data: {
    *    tagId: "" // 标签ID        
    * }
    * 30003: 删除构件
    * data: {
    *   tagId: "" // 标签ID
    * }
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
// 框选显示/隐藏
    type = 1002
    data = true/false
// 视角显示/隐藏
    type = 1003
    data = true/false
// 移动速度显示/隐藏
    type = 1004
    data = true/false
// 剖切显示/隐藏
    type = 1005
    data = true/false
// 测量显示/隐藏
    type = 1006
    data = true/false
// 标签显示/隐藏
    type = 1007
    data = true/false
// 小地图显示/隐藏
    type = 1008
    data = true/false
// 关注视点显示/隐藏
    type = 1009
    data = true/false
// 模型动画显示/隐藏
    type = 1010
    data = true/false
// 分解模型显示/隐藏
    type = 1011
    data = true/false
// 渲染环境显示/隐藏
    type = 1012
    data = true/false
// 浏览器显示/隐藏
    type = 1013
    data = ture/false
// 属性显示/隐藏
    type = 1014
    data = true/false
// 构件树的显示/隐藏
    type = 2001
    data = true/false
// 属性显示/隐藏
    type = 2002
    data = true/false
// 标签树显示/隐藏
    type = 2003
    data = true/false