import { getShareRedirectUrl, getVideoInfo } from "./handle";
import { initWebview, getWebview, fetchVideoInfoParams } from "./webview";

/**
 * @description: 解析分享链接
 * @param {String} shareUrl 分享链接
 * @return {Promise<Object>} 视频相关信息
 */
async function parseShareUrl(shareUrl) {
  const redirectUrl = await getShareRedirectUrl(shareUrl);
  const videoInfoParams = await fetchVideoInfoParams(redirectUrl);
  return await getVideoInfo(videoInfoParams);
}

/**
 * @description: 显示当前webview
 * @param {Vue} context 当前上下文
 */
function showWebview(context) {
  const currentWebview = context.$scope.$getAppWebview();
  currentWebview.append(getWebview());
}

/**
 * @description: 隐藏当前webview
 * @param {Vue} context 当前上下文
 */
function hideWebview(context) {
  const currentWebview = context.$scope.$getAppWebview();
  currentWebview.remove(getWebview());
}

/**
 * @description: 使用抖音sdk
 * @return {Promise<Object>} sdk对象
 */
export function useDouyin() {
  return new Promise(async (resolve) => {
    const webview = getWebview() || (await initWebview());
    resolve({ webview, showWebview, hideWebview, parseShareUrl });
  });
}
