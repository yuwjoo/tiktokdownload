import { once } from "../postMessage";

let wv = null; // webview实例

/**
 * @description: 初始化webview
 * @return {Promise<Webview>} 准备就绪后, 返回wevview实例
 */
export function initWebview() {
  if (wv) closeWebview();
  wv = plus.webview.create("/hybrid/html/index.html", "douyin-webview", {
    blockNetworkImage: true, // 禁用网络图片
    plusrequire: "ahead", // webview加载HTML时马上加载 h5+ api
  });
  wv.setJsFile("_www/static/preload.js");
  wv.overrideResourceRequest([
    {
      match: /.*/,
    },
  ]);

  return new Promise((resolve) => {
    once("pageAndUniReady", () => resolve(wv));
  });
}

/**
 * @description: 获取webview
 * @return {Webview} wevview实例
 */
export function getWebview() {
  return wv;
}

/**
 * @description: 关闭webview
 */
export function closeWebview() {
  if (wv) plus.webview.close(wv.id);
}

/**
 * @description: 获取视频信息api参数
 * @param {String} href 视频浏览页网址
 * @return {Promise<Object>} api链接相关参数
 */
export function fetchVideoInfoParams(href) {
  wv.evalJS(`window.getVideoInfoData('${href}')`);
  return new Promise((resolve) => {
    once("videoInfoData", ({ data }) => resolve(data));
  });
}
