# tcb-server-sdk

> 云开发云函数轻量级类路由库，主要用于优化服务端函数处理逻辑



##### 说明：

- 被路由的处理类要求继承RouteBase
- 云函数入口使用RouteHolder初始化路由对象，允许指定固定前缀
- RouteBase会自动使用wx-server-sdk初始化



## 示例

#### 云函数端

##### 目录结构

```groovy
\--- functions
	 +--- routeTest
	 	  +---- service
		  |		+---- user
		  |			  \---- Name.js
		  |		\---- Test.js
		  \---- index.js
		  \---- package.json
		  \---- package-lock.json
```



##### 入口文件

```javascript
const route = require("./tcb-server-sdk");

// 云函数入口函数
exports.main = async (event, context) => {

    console.log("入参：", event);
    //根据目录结构可以指定固定前缀为service
    //小程序端就可以使用user/Name/get访问到Name处理类里的get方法
    //如果不指定固定前缀，则需要使用service/user/Name/get才能访问到Name处理类里的get方法
    return await new route.RouteHolder("service").process(event);
};
```



##### 请求处理类 Name.js

```javascript
const route = require("./tcb-server-sdk");

class Name extends route.RouteBase {
    async get(params) {
        console.log("接口请求参数：", params);
        //这里的this.wxContext来自RouteBase
        return {"idol": "kobe", "wxContext": this.wxContext};
    }
}

module.exports = Name;
```



##### 小程序端

```javascript
//执行云函数
wx.cloud.callFunction({
    // 云函数名称
    name: "routeTest",
    // 传给云函数的参数
    data: {
        env: "test",// 环境可以不填
        uri: "user/Name/get",// 请求URL，云函数端的RouteHolder会找到对应的处理类并调用指定方法
        params: {"source":"1"}
    }
}).then(res => {
    
}).catch(res => {
    
}).then(res => {
    
});
```



开源链接：

https://github.com/showms/tcb-server-sdk.git