const cloud = require("wx-server-sdk");
const response = require('./lib/response');

"use strict";

class RouteHolder {
    #backLocation = "../../";
    #fixPrefix

    /**
     * 构造函数
     * @param fixPrefix 表示固定前缀，例如"service" 也可以不填
     */
    constructor(fixPrefix = "") {
        this.#fixPrefix = fixPrefix !== "" ? fixPrefix + "/" : fixPrefix;
    }

    /**
     * 处理函数
     * @param event 云函数event参数 包含两部分内容uri和params
     *              uri格式：user/Name/get
     *              params：表示接口入参，可以是字符串也可以是json格式
     * @returns {Promise<*>}
     */
    async process(event) {
        const {uri, params} = event;
        const {path, method} = await this._analyzeUri(uri, false);
        const module = require(path);
        const instance = module.getInstance(event);
        return await instance[method](params);
    }

    /**
     * 解析uri得到module_path以及将要执行的method
     * @param uri
     * @param secondTry 二次尝试，第一次解析如果没有找到module会拼接上index再次尝试解析一次
     * @returns {Promise<{path: string, method: any[]}>}
     * @private
     */
    async _analyzeUri(uri, secondTry) {
        const parts = uri.split("/");
        if (secondTry) {
            parts.push("index");
        }
        const method = parts.splice(-1, 1);
        const clazz = parts.splice(-1, 1);
        const midPath = parts.join("/") + (parts.length ? "/" : "");
        const path = this.#backLocation + this.#fixPrefix + midPath + clazz;
        if (!await this._moduleAvailable(path) && !secondTry) {
            return await this._analyzeUri(uri, true);
        }
        return {path, method};

    }

    /**
     * 判断模块是否存在
     * @param path
     * @returns {Promise<boolean>}
     * @private
     */
    async _moduleAvailable(path) {
        try {
            require.resolve(path);
            return true;
        } catch (e) {
            return false;
        }
    }
}

/**
 * 路由基类
 * 所有需要路由转发的类都需要继承这个类
 */
class RouteBase {
    static instance;
    cloud;
    db;
    _;
    $;
    wxContext;
    response;
    event;

    constructor(event = {}) {
        const {env} = event;
        cloud.init({
            //允许外部指定云开发环境
            env: env || cloud.DYNAMIC_CURRENT_ENV
        });
        this.cloud = cloud;
        //数据库，具体见云开发API
        this.db = cloud.database({
            throwOnNotFound: false
        });
        //数据库操作符，具体见云开发API
        this._ = this.db.command;
        //数据库聚合操作，具体见云开发API
        this.$ = this.db.command.aggregate;
        //用户上下文
        this.wxContext = cloud.getWXContext();
        //响应封装类
        this.response = response;
        this.event = event;
    }

    /**
     * 获取实例
     * @param event
     * @returns {*}
     */
    static getInstance(event = {}) {
        this.instance = new this(event);
        //console.log("重置用户上下文、入参信息，当前用户信息：", JSON.stringify(this.instance.wxContext));
        return this.instance;
    }

    /**
     * 调用云函数
     * @param name
     * @param data
     * @returns {Promise<unknown>}
     */
    callCloudFunction(name, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await this.cloud.callFunction({
                    // 要调用的云函数名称
                    name,
                    // 传递给云函数的参数
                    data
                });
                resolve(result);
            } catch (e) {
                reject(e);
            }
        });
    }
}

module.exports = {
    RouteHolder, RouteBase
}
