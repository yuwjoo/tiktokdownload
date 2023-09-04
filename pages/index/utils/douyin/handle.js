import { request } from "../request";

/**
 * @description: 获取分享链接重定向网址
 * @param {String} shareUrl 分享链接地址
 * @return {Promise<String>} 视频浏览网址
 */
export function getShareRedirectUrl(shareUrl) {
  return request({
    url: shareUrl,
    method: "get",
    beforeConnect: (connect) => {
      connect.setInstanceFollowRedirects(false); // 不自动跳转到重定向地址
    },
  }).catch(({ connect }) => connect.getHeaderField("Location"));
}

/**
 * @description: 获取视频信息
 * @param {String} options.videoInfoUrl 视频信息api接口
 * @param {String} options.cookie cookie数据
 * @param {String} options.userAgent 浏览器信息
 * @param {String} options.referer http请求来源
 * @return {Promise<Object>} 视频信息
 */
export function getVideoInfo(options) {
  return request({
    url: options.videoInfoUrl,
    method: "get",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "zh-CN,zh;q=0.9",
      Referer: options.referer,
      Cookie: options.cookie,
      "User-Agent": options.userAgent,
    },
  }).then(({ response }) => {
    const data = JSON.parse(response);
    const videoUrl = data["item_list"][0]["video"]["play_addr"]["url_list"][0];
    const posterUrl = data["item_list"][0]["video"]["cover"]["url_list"][0];
    return { videoUrl: videoUrl.replace("/playwm/?", "/play/?"), posterUrl };
  });
}
